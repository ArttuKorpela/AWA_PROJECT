import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Container } from '@mui/material';
import UploadButton from "./Uploadbutton";

/*
* The Register component is responsible for handling the registration of new users.
* It incorporates form inputs for user details, an image upload button for profile pictures,
* and validation for inputs like email and password.
*/

// State initialization for user data, profile image, preview source, and validation flags

const Register = ({ onRegister }) => {
    const [userData, setUserData] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [previewSrc, setPreviewSrc] = useState('');
    const [emailOK, setEmailError] = useState(true);
    const [passwordOK, setPasswordError] = useState(true);
    const [image, setImage] = useState(null)

    // Function to set email error flag

    const badEmail = () => {
        setEmailError(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        //reset error states
        setEmailError(true);
        setPasswordError(true);
        let imageURL = null;
        // Upload image if present
        if (image){
            imageURL = await uploadImage();
        }
        // Aggregate form data
        const formData = {
            first_name: e.target.first_name.value,
            last_name: e.target.last_name.value,
            email: e.target.email.value,
            password: e.target.password.value,
            punchline: e.target.punchline.value,
            bio: e.target.bio.value,
            picture_url: imageURL
        };

        //Check that all fields have information
        for (const [key, value] of Object.entries(formData)) {
            if (!value) {
                if (!key == "pic_url") { // 'pic_url' key does not need to be filled necessarily
                    alert(`Please fill in your ${key.replace('_', ' ')}`);
                    return;
                }
            }
        }
        console.log(formData);

        fetch("/api/user/register",{
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(formData),
            mode: "cors"
        })

            .then(response => {
                if (response.status === 200) {// Callback function to signal successful registration
                    response.json()
                        .then(data => {
                            console.log(data);
                            onRegister(true);
                        })
                } else if (response.status === 403) {// Set email error flag if email is taken or incorrect
                    badEmail()
                } else {
                    //Implement
                }
            })

    }
    // Update local state with form changes
    const handleChange = (e) => {
        setUserData({...userData,[e.target.name]:e.target.value});
    }
    // Handle image selection and set preview
    const handleImageChange = async (img) => {
        //Set the image preview
        setProfileImage(img);// Set preview source for the image
        setPreviewSrc(URL.createObjectURL(img));
        //save the image to a state
        setImage(img);
    };

    // Upload selected image to the server
    const uploadImage = async () => {
        //Check Image state that it has an image
        if (image) {
            try {
                //convert the image to a formdata
                const formData = createFormData(image);
                //Upload the image. If successful return the generated name
                const imageName = await postImage(formData);
                console.log('Uploaded image name:', imageName);
                return imageName;
            } catch (error) {
                console.error('Error uploading image:', error);
                return null
            }
        }

    }
    // Post image data to the server and return the response
    const postImage = async (formData) => {
        try {
            const response = await fetch('/api/images/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error("Error in image upload");
            }
            const data = await response.json();
            return data.imageName; // Return the name of the uploaded image
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }


    //Convert the image object to a formdata object
    const createFormData = (file) => {
        const formData = new FormData();
        formData.append('image', file, file.name);
        return formData;
    };




    return (
        <Container maxWidth="sm">
            <Card data-testid="register-card">
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Register
                    <form onSubmit={handleSubmit} onChange={handleChange}>
                        {previewSrc && <img src={previewSrc} alt="Profile Preview" height="100" />}
                        <TextField
                            data-testid = "firstname-field"
                            label="First Name"
                            variant= "outlined"
                            fullWidth
                            margin="normal"
                            type="name"
                            name="first_name"
                            required

                        />
                        <TextField
                            data-testid = "lastname-field"
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="name"
                            name="last_name"
                            required
                        />

                        <TextField
                            id="email"
                            data-testid = "register-email-field"
                            label={emailOK ? "Email":"Error"}
                            variant=  "outlined"
                            fullWidth
                            margin="normal"
                            type="email"
                            name="email"
                            helperText={emailOK ? "":"Email taken or incorrect"}
                            error={!emailOK}
                            required
                        />
                        <TextField
                            id="password"
                            data-testid = "password-field"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="password"
                            name="password"
                            required
                        />

                        <TextField
                            data-testid = "punchline-field"
                            label="Punchline"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="punchline"
                            name="punchline"
                            required
                        />
                        <TextField
                            data-testid = "bio-field"
                            label="Bio"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="bio"
                            name="bio"
                            required
                            multiline
                            minRows={3}
                            maxRows={10}

                        />


                        <UploadButton
                            handleImageChange={handleImageChange} ></UploadButton>
                        {/* Add any other input fields for registration */}
                        <Button
                            data-testid = "create-user-button"
                            variant="contained"
                            color="primary"
                            type="submit" fullWidth>
                            Register
                        </Button>
                    </form>

                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Register;