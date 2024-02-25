import * as React from 'react';
import { useEffect, useState } from "react";
import { Box, Card, CardActions, CardContent, CardHeader, CardMedia, Button, Typography, IconButton } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PopUp from "./PopUp";

//The home component provides the user with other user to match with
export default function Home(props) {
    const {setChatMode, setValue, matches} = props;
    //SetChatMode: State setter that will open the chat window
    //setValue: Is a state state setter that will change the tab on mobile
    //matches: Contains the users current matches.


    const [user, setUser] = useState(null); //The current user shown
    const [popup, setPopup] = useState(false) //If a match is made the popup state is activated
    const [chatID, setChatID] = useState(null);//The chatID contains the chatID of the mnew match
    const [matchedUser, setMatchedUser] = useState({}); // This state keeps the last matched user for the chat

    //get the first user when app is opened
    useEffect(() => {
        getUser();
    }, []); // Dependency array is empty, so this effect runs only once on mount

    //get user fetches a user from the database
    const getUser = () => {
        const token = localStorage.getItem('token');

        if (token) {
            fetch("/api/user/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ matches: matches }) //Send the current matches to exlcude them
            }).then(async response => {
                if (!response.ok) {
                    setUser(null);
                } else {
                    const data = await response.json();
                    setUser(data.user); //Set the user to the state and the page will update
                }
            });
        } else {
            //handle authentication. The page is refressed and if no token is found the login page will show
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
    //This function checks if there is a match when the user likes anoher user
    async function checkMatch(userID, likeID) {
        const token = localStorage.getItem("token");
        try {
            return fetch("/api/user/match", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({userID: userID, likeID: likeID})
            }).then(response => {
                if (!response.ok) {
                    throw new Error("Error in match making response");
                }
                // For a 200 status, null is returned directly from this promise chain.
                if (response.status === 200) {
                    return null;
                }
                // For a 201 status, wait for the json() promise to resolve and then return chatID.
                if (response.status === 201) {
                    return response.json().then(data => {
                        console.log("This works " + data.chatID);
                        return data.chatID; // This return value will be the resolved value of the outer promise chain.
                    });
                }
            });
        } catch (e) {
            console.error("Error in fetching match", e);
            throw e; // Make sure to rethrow the error to not swallow it silently.
        }
    }

    const handleUserAction = async (likeOrDislike) => {
        if (likeOrDislike === "Like") {
            const user_info = decodeJWT(localStorage.getItem("token"))
            //Check if a match is found
            const match_status = await checkMatch(user_info._id, user._id);
            if (match_status) {
                setMatchedUser({...user}); // The matched users state will be updated
                setChatID(match_status) //MatchStatus has the chat id
                setPopup(true) // Trigger the popup
            }
        }


        // Fetch a new user
        getUser();

        //console.log(`${likeOrDislike} user with ID: ${user._id}`);
    };

    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', padding: "5px"}}>
            <Card data-testid="home-card">
                <Box>
                    <CardHeader action={<IconButton aria-label="settings"><MoreVertIcon /></IconButton>} />
                    <CardMedia sx={{
                        maxHeight: '60vh'
                    }}
                        component="img"
                        alt="User profile picture"
                        image={user.picture_url ? `http://localhost:5000/api/images/${user.picture_url}` : "/no-img.jpg"}
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
            {popup ? <PopUp open={popup} setOpen={setPopup} setChatMode={setChatMode} user={matchedUser} chatID={chatID} setValue={setValue}/> : null }
        </Box>
    ); //If a match is found the popup state will be triggered
};