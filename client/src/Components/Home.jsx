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

    const handleUserAction = (likeOrDislike) => {
        // Add the current user's ID to the list of user IDs
        if (user && user.id) {
            setUserIds(prevUserIds => [...prevUserIds, user.id]);
        }

        // Fetch a new user
        getUser();

        console.log(`${likeOrDislike} user with ID: ${user.id}`);
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
            <Card sx={{ maxWidth: 345 }}>
                <CardHeader action={<IconButton aria-label="settings"><MoreVertIcon /></IconButton>} />
                <CardMedia
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
                <CardActions disableSpacing sx={{ justifyContent: 'center' }}>
                    <Button
                        startIcon={<HeartBrokenIcon />}
                        variant="outlined"
                        sx={{ mr: 5 }}
                        onClick={() => handleUserAction('Dislike')}
                    >
                        Dislike
                    </Button>
                    <Button
                        startIcon={<FavoriteIcon />}
                        variant="contained"
                        sx={{ ml: 5 }}
                        onClick={() => handleUserAction('Like')}
                    >
                        Like
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}