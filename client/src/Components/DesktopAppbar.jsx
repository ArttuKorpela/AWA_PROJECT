import React, {useEffect, useState} from 'react';
import {AppBar, Avatar, Box, IconButton, Toolbar, Tooltip, Typography} from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";

const DesktopAppbar = (props) => {
    // Destructure props to extract the state and setter function related to profile mode.
    const { setProfileMode, profileMode } = props;

    // State to manage the profile picture URL. Initializes with a default picture.
    const [pic, setPic] = useState("../public/logo192.png");

    // Base URL for fetching profile images.
    const url = "http://localhost:5000/api/images/";

    // useEffect hook to fetch the profile picture once the component mounts.
    useEffect(() => {
        fetchProfilePic();
    }, []);

    // Function to fetch the profile picture from the server.
    const fetchProfilePic = async () => {
        fetch("/api/user/profile", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`, // Use the stored JWT for authentication.
            },
            mode: "cors" // Ensures requests are made with CORS policy.
        }).then(response => {
            if (!response.ok) {
                // If the response is not OK, fall back to the default picture.
                setPic("./public/logo192.png");
            } else {
                // If the response is OK, update the profile picture state with the fetched URL.
                response.json().then(data => {
                    setPic(url + data.user.picture_url);
                })
            }
        })
    };



    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Arttu's Dating App
                        </Typography>

                        <Tooltip title={"Toggle profile"}>
                            <IconButton aria-label="profile" onClick={() => { profileMode ? setProfileMode(false) : setProfileMode(true)}}>
                                <Avatar src= {pic}/>
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
    );
};

export default DesktopAppbar;