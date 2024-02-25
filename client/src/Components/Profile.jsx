import React, { useState, useEffect } from 'react';
import {Card, CardHeader, CardContent, TextField, IconButton, Box} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import UploadButton from "./Uploadbutton";

const Profile = () => {
    const url = "http://localhost:5000/api/images/";

    const [name, setName] = useState("");

    const [profileData, setProfileData] = useState({
        punchline: "",
        bio: "",
    });
    const [editMode, setEditMode] = useState({
        punchline: false,
        bio: false,
    });

    const [previewSrc, setPreviewSrc] = useState('');


    useEffect(() => {
        // Fetch profile data from the server
        fetchProfileData(getTokenFromStorage()); //Fetch the profile data using the JWT token
    }, []);


    const getTokenFromStorage = () => {
        return localStorage.getItem("token");
    }

    const fetchProfileData = (token) => {
        fetch("/api/user/profile", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            mode: "cors"
        }).then(response => {
            if (!response.ok) {
                throw new Error("No profile found")
            } else {
                response.json().then(data => {
                    //Set the state to the fetched info
                    setProfileData({
                        punchline: data.user.punchline,
                        bio: data.user.bio,
                    });
                    //Set the name
                    setName(data.user.first_name + " " + data.user.last_name);

                    //Set the picture url state also
                    setPreviewSrc(url + data.user.picture_url);
                })
            }
        })

    };

    const handleEdit = (field) => {
        setEditMode({ ...editMode, [field]: true });
    };

    const handleSave = (field, value) => {
        //console.log(field + " : " + value)

        setEditMode({ ...editMode, [field]: false }); // Turn of the edit mode
        //Send the data to the server
        fetch("/api/user/update", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getTokenFromStorage()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({value: value, field: field}),
            mode: "cors"
        }).then(response => {
            if (!response.ok) {
                throw new Error("No profile found, couldn't update profile")
            } else {
                // Update profileData with new value
                setProfileData({ ...profileData, [field]: value });
            }
        })

    };

    const handleChange = (field, event) => {
        setProfileData({ ...profileData, [field]: event.target.value });
    };

    const handleImageChange = async (img) => {
        //Set the image preview
        setPreviewSrc(URL.createObjectURL(img));
        //save the image to a state
        await uploadImage(img); //Upload to the image server
    };

    const uploadImage = async (image) => {
        //Check Image state that it has an image

        if (image) {
            try {
                //convert the image to a formdata
                const formData = createFormData(image);
                //Upload the image.
                await postImage(formData);
            } catch (error) {
                console.error('Error uploading image:', error);
                return null
            }
        }

    }

    const postImage = async (formData) => {
        try {
            const response = await fetch('/api/images/update', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error("Error in image upload");
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }


    //Convert the image object to a formdata object
    const createFormData = (file) => {
        const formData = new FormData();
        formData.append('image', file, file.name);
        formData.append('token', getTokenFromStorage());
        return formData;
    };


    return (
        <Card sx={{ maxWidth: 345, m: 2 }}>
            <CardHeader title= {name} />
            <CardContent>
                <Box sx={{maxWidth:"80vw"}}>
                    <img src={previewSrc} style={{maxWidth:"inherit", maxHeight:"400px"}} /><img/>
                    <UploadButton handleImageChange={handleImageChange}></UploadButton>

                </Box>
                <Box>
                {Object.keys(profileData).map((key) => (
                    <div key={key} style={{marginBottom: '20px'}}>
                        {!editMode[key] ? (
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <span>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${profileData[key]}`}</span>
                                <IconButton onClick={() => handleEdit(key)} size="small">
                                    <EditIcon/>
                                </IconButton>
                            </div>
                        ) : (
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <TextField
                                    fullWidth
                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                    variant="outlined"
                                    size="small"
                                    value={profileData[key]}
                                    onChange={(event) => handleChange(key, event)}
                                />
                                <IconButton onClick={async () => handleSave(key, profileData[key])} size="small">
                                    <SaveIcon/>
                                </IconButton>
                            </div>
                        )}
                    </div>
                ))}
                </Box>
            </CardContent>
        </Card>
    );
};


export default Profile;