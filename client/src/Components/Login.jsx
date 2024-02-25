import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Container } from '@mui/material';
import shadows from "@mui/material/styles/shadows";

const Login = ({ onLogin }) => {
    // The Login component accepts a prop `onLogin` which is a function to be called upon successful login
    // State variables to store the email, password, and error states for wrong password/email
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [wrongPassword, setWrongPassword] = useState(false);
    const [wrongEmail, setWrongEmail] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //reset all errors
        setWrongPassword(false);
        setWrongEmail(false);
        // Making a POST request to the login API with the email and password

        fetch("/api/user/login",{
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email:email,
                password:password
            }),
            mode: "cors"
        })
            .then(response => {
                if (response.status === 200) { // If login is successful
                    response.json()
                        .then(data => {
                            console.log(data); // Log the response data
                            localStorage.setItem("token", String(data.token)); // Store the received token in localStorage
                            window.location.replace(window.location.href); // Reload the page to reflect the login state
                        })
                } else if (response.status === 400) { // If the email is incorrect
                    setWrongEmail(true);
                } else if (response.status === 403) { // If the password is incorrect
                    setWrongPassword(true);
                } else { // Handle any other errors
                    console.log("Error in login");
                }
            })
    };

    return (
        <Container maxWidth="sm">
            <Card data-testid="login-card">
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            data-testid= "email-field"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="email"
                            helperText={!wrongEmail ? "":"Incorrect Email"}
                            error={wrongEmail}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            data-testid= "password-field"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="password"
                            helperText={!wrongPassword ? "":"Password incorrect"}
                            error={wrongPassword}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            data-testid="login-button"
                            variant="contained"
                            color="primary"
                            type="submit" fullWidth>
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};
 export default Login;
