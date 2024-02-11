import * as React from 'react';
import { useEffect, useState } from "react";
import { Box, Card, CardActions, CardContent, CardHeader, CardMedia, Button, Typography, IconButton } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function ImgMediaCard() {
    const [user, setUser] = useState(null);
    const [userIds, setUserIds] = useState([]);

    useEffect(() => {
        getUser();
    }, []); // Dependency array is empty, so this effect runs only once on mount

    const getUser = () => {
        const token = localStorage.getItem('token');

        if (token) {
            fetch("/api/user/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ excludedUserIds: userIds }) // Assuming your API can exclude users by IDs
            }).then(async response => {
                if (!response.ok) {
                    setUser(null);
                } else {
                    const data = await response.json();
                    setUser(data.user);
                }
            });
        } else {
            //handle authentication
            window.location.replace(window.location.href)
        }
    };

    function decodeJWT(token) {
        // Split the JWT token into its parts
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT token');
        }

        // The payload is the second part of the token
        const payload = parts[1];

        // Decode the payload from base64
        const decodedPayload = atob(payload);

        // Parse the JSON payload
        const decodedJSON = JSON.parse(decodedPayload);

        return {
            _id: decodedJSON.id,
            email: decodedJSON.email
        };
    }

    async function checkMatch(userID, likeID) {

        const token = localStorage.getItem("token");
        try {
            return fetch("/api/user/match",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                    ,
                    body: JSON.stringify({userID: userID, likeID: likeID})
                }).then(response => {
                if (!response.ok) {
                    throw new Error("Error in match making response");
                } else {
                    //New match created but no reverse match
                    if (response.status === 200) {
                        return false
                    }
                    //Match with a reverse match
                    if (response.status === 201) {
                        return true
                    }
                }
            })
        } catch (e) {
            console.error("Error in fetching match", e);
        }
    }

    const handleUserAction = async (likeOrDislike) => {
        if (likeOrDislike === "Like") {
            const user_info = decodeJWT(localStorage.getItem("token"))
            //Check if a match is found
            const match_status = await checkMatch(user_info._id, user._id);
            console.log(match_status)
            if (match_status) {
                //Update the chat list
                alert(`You matched with ${user.first_name}`)
            }
        }


        // Add the current user's ID to the list of user IDs
        if (user && user._id) {
            setUserIds(prevUserIds => [...prevUserIds, user._id]);
        }

        // Fetch a new user
        getUser();

        console.log(`${likeOrDislike} user with ID: ${user._id}`);
    };

    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card sx={{

            }}>
                <Box>
                    <CardHeader action={<IconButton aria-label="settings"><MoreVertIcon /></IconButton>} />
                    <CardMedia sx={{
                        maxHeight: '60vh'
                    }}
                        component="img"
                        alt="User profile picture"
                        image={user.picture_url ? `http://localhost:5000/api/images/${user.picture_url}` : "http://localhost:5000/api/images/default_image.jpeg"}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {`${user.first_name} ${user.last_name}`}
                        </Typography>
                        <Typography variant="body1">{user.punchline}</Typography>
                        <Typography variant="body2" color="text.secondary">{user.bio}</Typography>
                    </CardContent>
                </Box>
                <CardActions disableSpacing sx={{
                    justifyContent: 'space-between', // This distributes the buttons evenly
                    padding: '0 16px', // Adjust this value for more or less padding around the buttons
                    '& .MuiButton-root': {flexGrow: 1, margin: '8px'}
                }}>
                    <Button
                        startIcon={<HeartBrokenIcon/>}
                        variant="outlined"
                        onClick={() => handleUserAction('Dislike')}
                    >
                        Dislike
                    </Button>
                    <div style={{flexBasis: '16px'}}></div>
                    <Button
                        startIcon={<FavoriteIcon/>}
                        variant="contained"
                        onClick={() => handleUserAction('Like')}
                    >
                        Like
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
};