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

// The Chat component, which manages the chat interface.
const Chat = (props) => {
    // Destructure props to extract chat information and a setter function to toggle chat mode.
    const {chatInfo, setChatMode} = props;
    // Base URL for fetching images.
    const url = "http://localhost:5000/api/images/";
    // State to manage the user ID of the message sender.
    const ownID = getUserID();
    // State for tracking the time of the last message.
    const [lastMessageTime, setLastMessageTime] = useState(null);
    // State for storing chat messages.
    const [messages, setMessages] = useState([]);
    // State for managing the content of a new message.
    const [newMessage, setNewMessage] = useState({ content: "", sender: ownID, time:{}});

    // Effect hook to clear messages and fetch chat history when the chatInfo changes.
    useEffect(() => {
        console.log(ownID)
        setMessages([]);
        getChats(chatInfo.chat);
    }, [chatInfo]);

    // Function to decode JWT from localStorage and extract the user ID.
    function getUserID() {
        const token = localStorage.getItem("token");
        const payload = token.split('.')[1]; // Get the payload
        const decoded = atob(payload);// Decode base64 payload to string
        const data = JSON.parse(decoded); // Parse the JSON string to an object.
        return data.id;
    }

    const handleSendMessage = async () => {
        if (!newMessage.content) return; // Prevent sending empty messages
        //Let's send the message to the db
        await sendMessageToDB(newMessage.content, chatInfo.chat)//Only message content and chatID are needed. Other info is gotten from the token.
        newMessage.time = new Date(); // Record the time the message was sent.
        setMessages([...messages, newMessage]);// Add the new message to the chat.
        setNewMessage({ content: "", sender: ownID, time:{} }); // Reset input field after sending
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
            setMessages(data.messages);// Update the chat messages state with fetched data.
            //Get the time of the latest message and concert it to a DateObject
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
        <Card sx={{
            width: "95vw",
            height: "90vh",
            display: 'flex',
            flexDirection: 'column'
        }}>
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
                        <Grid container key={index} justifyContent={message.sender === ownID ? 'flex-end':'flex-start'}>
                            <ListItem sx={{
                                //The color and position of the messages is set messages sender id. If own then right and color primary
                                bgcolor: message.sender === ownID ? 'primary.light':'secondary.light',
                                borderRadius: '20px',
                                maxWidth: '80%',
                                mb: 1,
                                wordBreak: 'break-word'
                            }}>
                                <ListItemText primary={message.content} secondary={(new Date(message.time)).toLocaleTimeString()}/>
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
