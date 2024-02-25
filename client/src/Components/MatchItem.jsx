import React, {useState} from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import {
    Avatar,
    Card,
    CardContent, IconButton,
    List,
    ListItem,
    ListItemAvatar, ListItemButton,
    ListItemText,
    Tooltip,
    Typography
} from "@mui/material";

/*
    This Component's task is to be a listItem that contains a card that displays
    information about the match. On clicking the card changes the chatMode state.
    This state is either null  or contains information about the picked user
    and the chatID of the Chat collection that stores the messages between these
    two users.
*/
const MatchItem = (props) => {
    const url = "http://localhost:5000/api/images/";
    const {user,chatID,setChatMode, setIsDialogOpen} = props;
    //User: The users data that is shown in the item
    //ChatID: The id of chat collection that holds chats between the users
    //SetChatMode: State's setter that will hold the user and chatID
    //SetIsDialogOpen: State's setter that will hold the user data

    const handleClick = () => {
        setChatMode({user:user,chat:chatID});
    }//This will open the chat window to the user.


    return (
            <ListItem alignItems="flex-start">
                <Card sx = {{width: "100%"}}>
                    <CardContent sx={{display: "flex"}}>
                        <ListItemAvatar>
                            <Avatar alt="No Pic" src={url + user.picture_url}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={user.first_name + " " + user.last_name}
                            secondary= {user.punchline}
                            onClick={() => setIsDialogOpen(user)}
                        />
                        <IconButton onClick={handleClick}>
                            <ChatIcon/>
                        </IconButton>
                    </CardContent>
                </Card>
            </ListItem>
    );
};

export default MatchItem;