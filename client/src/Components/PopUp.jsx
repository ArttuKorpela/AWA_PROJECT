import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide} from "@mui/material";
/*
* This component is responsible for the popup that occurs when a mathc is found.
* It contains a button that when pressed the user is presented with the chat window
* */

//This variable holds the options needed to make the popup appear from the bottom
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const PopUp = (props) => {
    const {open, setOpen, user, setChatMode, chatID, setValue} = props
    //open: State that triggers the dialog
    //SetOpen: Setter that is used to close the dialog
    //user: contains matched users data
    //setChatMode: Setter that opens the chat window
    //ChatID: contains the id of the collection that keeps the messages for the match-user and user
    //SetValue: Is a setter that is used to change the tab on the mobile layout


    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = () => {

        if (setValue) {
            setValue(2);
        }
        //If on mobile set value will be provided
        //Value is used to move between mobile tabs.
        setChatMode({user:user,chat:chatID});
        //So if on mobile the chatMode is activated as the
    }
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}

        >
            <DialogTitle>{"A Match!"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {"You matched with " + user.first_name}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClick()}>Chat </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopUp;