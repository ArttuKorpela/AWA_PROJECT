import React, {useEffect, useState} from 'react';
import {Box, Card, CardContent, CardHeader, IconButton, List, ListItem, Typography} from "@mui/material";
import MatchItem from "./MatchItem";
import FaceIcon from "@mui/icons-material/Face";
import UserPopUp from "./UserPopUp";


// Component definition accepting props
const Matches = (props) => {
    // Destructuring props to extract functions
    const { setChatMode, setMatches } = props;
    // State for controlling the dialog visibility
    const [isDialogOpen, setIsDialogOpen] = useState(null);

    // State to hold the matches fetched from the API
    let [users, setUsers] = useState(null);

    // Effect hook to fetch matches on component mount
    useEffect(() => {
        getMatches();
    }, []);

    // Function to fetch matches from the server
    function getMatches() {
        try {
            // Retrieve the authentication token from local storage
            const token = localStorage.getItem('token');
            fetch("/api/matches/all", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                if (response.status === 404) {
                    // Handle case where no matches are found
                    setUsers(null);
                } else {
                    response.json().then(data => {
                        // Update local state with fetched matches
                        setUsers(data.matches);
                        // Update external state with matches for other components
                        setMatches(data.matches);
                    });
                }
            });
        } catch (e) {
            console.error("Error in fetching match", e);
        }
    }

    // Function to handle the closing of the dialog
    const handleDialogClose = () => {
        setIsDialogOpen(null);
    };

    // Component render method
    return (
        <Box>
            <Card>
                <CardHeader title={"Matches and Chat's"} />
                <CardContent>
                    <List sx={{ width: '100%', minHeight: "100px"}}>
                        {users && users.map((user) => (
                            // Render a MatchItem for each user
                            <MatchItem key={user.user._id} user={user.user} chatID={user.chatID} setChatMode={setChatMode} setIsDialogOpen={setIsDialogOpen}/>
                        ))}
                    </List>
                </CardContent>
            </Card>
            {/* Popup dialog for user interactions */}
            <UserPopUp open={isDialogOpen} onClose={handleDialogClose} />
        </Box>
    );
};

// Export the component for use in other parts of the application
export default Matches;