import React, {useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    CardActions,
    TextField,
    Button,
    List,
    ListItem,
    Grid,
    ListItemText, CardHeader, Avatar, IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';

const testmessages = [
    { content: "Hello, how are you?", sender: "someoneelse" },
    { content: "I'm good, thanks! How about you?", sender: "someoneelse" },
    // Add more messages here
];

const Chat = (props) => {
    const {chatInfo, setChatMode} = props;
    const url = "http://localhost:5000/api/images/";
    const ownID = getUserID();
    const [lastMessageTime, setLastMessageTime] = useState(null);
    const [messages, setMessages] = useState(testmessages);
    const [newMessage, setNewMessage] = useState({ content: "", sender: ownID });

    useEffect(() => {
        setMessages([]);
        getChats(chatInfo.chat);
    }, [chatInfo]);

    function getUserID() {
        const token = localStorage.getItem("token");
        const payload = token.split('.')[1]; // Get the payload
        const decoded = atob(payload);
        const data = JSON.parse(decoded);
        return data._id;
    }

    const handleSendMessage = () => {
        if (!newMessage.content) return; // Prevent sending empty messages
        //Let's send the message to the db
        sendMessageToDB(newMessage.content, chatInfo.chat) //Only message content and chatID are needed. Other info is gotten from the token.
        setMessages([...messages, newMessage]);
        setNewMessage({ content: "", sender: chatInfo.user._id }); // Reset input field after sending
    };

    const sendMessageToDB = async (message, chatID) => {
        const token = localStorage.getItem("token")
        try {
            const response = await fetch("/api/matches/chat/input/", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatID: chatID,
                    newMessage: message
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            //Reset the last messagetime to current message
            setLastMessageTime(new Date().toLocaleTimeString())
        } catch (error) {
            console.error('Error sending chats:', error);
        }
    }



    const getChats = async (chatID) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("/api/matches/chat/get/", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatID: chatID,
                })
            });

            if (!response.ok) {
                // Handle HTTP errors
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data.messages)
            setMessages(data.messages);
            //Get the time og the latest message and concert it to a DateObject
            const time = new Date(data.messages[data.messages.length-1].time);
            const string_time = time.toLocaleTimeString() //Convert to browsers time format
            setLastMessageTime(string_time);
            console.log(lastMessageTime)
        } catch (error) {
            console.error('Error fetching chats:', error);
            setMessages([]);
        }
    };

    return (
        <Card sx={{ maxWidth: 500, minHeight: 300 }}>
            <CardHeader
                avatar={
                    <Avatar src={url+chatInfo.user.picture_url}/>
                }
                //Setting the chatmode null closes the chat window
                action={
                    <>
                        <IconButton aria-label="refresh" onClick={() => getChats(chatInfo.chat)}>
                            <RefreshIcon/>
                        </IconButton>
                        <IconButton aria-label="close" onClick={() => setChatMode(null)}>
                            <CloseIcon/>
                        </IconButton>
                    </>
                }
                title={chatInfo.user.first_name + " " + chatInfo.user.last_name}
                subheader={"Last message: " + lastMessageTime}
            />
            <CardContent sx={{ height: "95%", overflow: 'auto' }}>
                <List>
                    {messages.map((message, index) => (
                        <Grid container key={index} justifyContent={message.sender === chatInfo.user._id ? 'flex-start' : 'flex-end'}>
                            <ListItem sx={{
                                bgcolor: message.sender === chatInfo.user._id ? 'secondary.light':'primary.light',
                                borderRadius: '20px',
                                maxWidth: '80%',
                                mb: 1,
                                wordBreak: 'break-word'
                            }}>
                                <ListItemText primary={message.content} />
                            </ListItem>
                        </Grid>
                    ))}
                </List>
            </CardContent>
            <CardActions>
                <TextField
                    variant="outlined"
                    size="small"
                    label="Type a message..."
                    fullWidth
                    value={newMessage.content || ''}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button variant="contained" endIcon={<SendIcon />} onClick={handleSendMessage}>
                    Send
                </Button>
            </CardActions>
        </Card>
    );
};

export default Chat;
