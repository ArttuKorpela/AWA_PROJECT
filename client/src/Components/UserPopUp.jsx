import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

/*This component is used to show the matches general information to
the user. When the MatchItem component's name is clicked the user
object is stored to the Match components state. This state is passed
onto this component in the open-prop.
*/

const UserPopUp = ({ open, onClose }) => {
    //The onClose is just a function that set's the open state null
    if (!open) {
        return null
    }
    //If open is null then the popup isn't triggered

    const { first_name, last_name, picture_url, punchline, bio, time } = open;
    //Take all the needed information out of the open state.
    const creation_time = new Date(time); //Get the time the user created the account
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>User Information</DialogTitle>
            <DialogContent dividers>
                <div style={{textAlign: 'center'}}>
                    <img src={"/api/images/"+picture_url} alt={`${first_name} ${last_name}`}
                         style={{width: '100px', height: '100px', borderRadius: '50%'}}/>
                    <h3>{`${first_name} ${last_name}`}</h3>
                    <p><strong>Punchline:</strong> {punchline}</p>
                    <p><strong>Bio:</strong> {bio}</p>
                    <p><strong>Created:</strong> {creation_time.getDate() + "." + creation_time.getMonth()+ "."+creation_time.getFullYear()}</p>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserPopUp;
