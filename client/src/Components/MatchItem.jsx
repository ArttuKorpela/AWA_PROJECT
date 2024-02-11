import React from 'react';
import {
    Avatar,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tooltip,
    Typography
} from "@mui/material";

const MatchItem = (props) => {
    const url = "http://localhost:5000/api/images/";
    const {user} = props;
    const moreInfo = <React.Fragment>
        <img style={{maxWidth:"300px"}} alt={"No picture"} src={url+user.picture_url}/>
        <Typography variant={"h6"} color="inherit" >{user.first_name} {user.last_name}</Typography>
        {/* New line */}
        <Typography variant={"body1"}>{"\""+user.punchline+"\""}</Typography>
        {}
        <Typography variant={"body2"}>{user.bio}</Typography>
    </React.Fragment>
    return (
        <Tooltip title={moreInfo} placement={"right"}>
            <ListItem alignItems="flex-start">
                <Card sx = {{width: "100%"}}>
                    <CardContent sx={{display: "flex"}}>
                        <ListItemAvatar>
                            <Avatar alt="No Pic" src={url + user.picture_url}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={user.first_name + " " + user.last_name}
                            secondary= {user.punchline}
                        />
                    </CardContent>
                </Card>
            </ListItem>
        </Tooltip>
    );
};

export default MatchItem;