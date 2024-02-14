import '../App.css';
import React, {useState} from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FaceIcon from '@mui/icons-material/Face';
import Home from '../Components/Home'
import Matches from "./Matches";
import Chat from "./Chat";
import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
const Mobile = (props) => {
    const {setChatMode, chatMode} = props;
    const [value, setValue] = useState(1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <div className={"content-container-mobile"}>
                {value === 0 && <div>user info goes here</div>}
                {value === 1 && <Home />}
                {value === 2 && !chatMode && <Matches setChatMode = {setChatMode} />}
                {value === 2 && chatMode && <Chat chatInfo={chatMode} setChatMode = {setChatMode}/>}
            </div>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation value={value} onChange={handleChange} showLabels>
                    <BottomNavigationAction label="User" icon={<FaceIcon />} />
                    <BottomNavigationAction label="Home" icon={<FavoriteBorderIcon />} />
                    <BottomNavigationAction label="Matches" icon={<ChatBubbleOutlineIcon />} />
                </BottomNavigation>
            </Paper>
        </div>
    );
};

export default Mobile;

