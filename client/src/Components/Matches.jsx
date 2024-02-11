import React, {useEffect, useState} from 'react';
import {Box, Card, CardContent, List, ListItem, Typography} from "@mui/material";
import MatchItem from "./MatchItem";

const Matches = () => {
    useEffect(() => {
        getMatches()
    }, []);

    let [users, setUsers] = useState(null);
    function getMatches() {
        try {
            const token = localStorage.getItem('token');
            fetch("/api/matches/all",
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => {
                if (response.status === 404) {
                    setUsers(null)  //No mathces found
                } else {
                    response.json().then(data => {
                        console.log(data.matches)
                        setUsers(data.matches);
                    });
                }
            });
        } catch (e) {
            console.error("Error in fetching match", e);
        }
    }






    return (
        <Box >
            <Card>
                <CardContent>
                    <Typography variant="h6">
                        Your Matches
                    </Typography>
                    <List sx={{ width: '100%', minHeight: "100px"}}>
                    {users && users.map((user) => {
                        return <MatchItem key={user.user._id} user={user.user}/>
                    })}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Matches;