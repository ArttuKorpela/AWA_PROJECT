import '../App.css';
import React, {useState} from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FaceIcon from '@mui/icons-material/Face';
import Home from '../Components/Home'
import Matches from "./Matches";
import Chat from "./Chat";
import Profile from "./Profile";
import {BottomNavigation, BottomNavigationAction, Box, Paper} from "@mui/material";

/*
* This component handles the mobile layout
* It mainly utilizes the BottomNavigation component to split the windows
* into their own sections
* */
const Mobile = (props) => {
    const {setChatMode, chatMode, matches, setMatches} = props;
    //SetChatMode: State setter that will open the chat window
    //Chatmode: state that contains the chat users info and the chatID of that person
    //matches: Contains the users current matches.
    //SetMathces: Sets the previous state
    const [value, setValue] = useState(1);//The value state is the current vieved tab


    //HandleChange just takes the event and the value of the bottom navigation the user pressed and
    //sets the state to update the component shown to the user
    // 0 : Own profile
    // 1 : Home where the user likes and dislikes
    // 2 : Mathes and chat window
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Box display="flex"
                 justifyContent="center"
                 alignItems="center"
                 height={"90vh"}
            >
                {value === 0 && <Profile/>}
                {value === 1 && <Home setChatMode={setChatMode} setValue={setValue} matches={matches}/>}
                {value === 2 && !chatMode && <Matches setChatMode = {setChatMode} setMatches={setMatches} />}
                {value === 2 && chatMode && <Chat chatInfo={chatMode} setChatMode = {setChatMode}/>}
            </Box>
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

