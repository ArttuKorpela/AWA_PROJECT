import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Container } from '@mui/material';
import UploadButton from "./Uploadbutton";

const Register = ({ onRegister }) => {
    const [userData, setUserData] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [previewSrc, setPreviewSrc] = useState('');
    const [emailOK, setEmailError] = useState(true);
    const [passwordOK, setPasswordError] = useState(true);
    const [image, setImage] = useState(null)

    const badEmail = () => {
        setEmailError(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        //reset error states
        setEmailError(true);
        setPasswordError(true);
        let imageURL = null;

        if (image){
            imageURL = await uploadImage();
        }

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
                if (!key == "pic_url") {
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
                if (response.status === 200) {
                    response.json()
                        .then(data => {
                            console.log(data);
                            onRegister(true);
                        })
                } else if (response.status === 403) {
                    badEmail()
                } else {
                    //Implement
                }
            })

    }
    const handleChange = (e) => {
        setUserData({...userData,[e.target.name]:e.target.value});
    }
    const handleImageChange = async (img) => {
        //Set the image preview
        setProfileImage(img);
        setPreviewSrc(URL.createObjectURL(img));
        //save the image to a state
        setImage(img);
    };

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
            return data.imageName;
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



    //IMPLEMENT REGISTER
    return (
        <Container maxWidth="sm">
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Register
                    <form onSubmit={handleSubmit} onChange={handleChange}>
                        {previewSrc && <img src={previewSrc} alt="Profile Preview" height="100" />}
                        <TextField
                            label="First Name"
                            variant= "outlined"
                            fullWidth
                            margin="normal"
                            type="name"
                            name="first_name"
                            required

                        />
                        <TextField
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
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="password"
                            name="password"
                            required
                        />

                        <TextField
                            label="Punchline"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="punchline"
                            name="punchline"
                            required
                        />
                        <TextField
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


                        <UploadButton handleImageChange={handleImageChange} ></UploadButton>
                        {/* Add any other input fields for registration */}
                        <Button variant="contained" color="primary" type="submit" fullWidth>
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