import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Container } from '@mui/material';
import shadows from "@mui/material/styles/shadows";

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [wrongPassword, setWrongPassword] = useState(false);
    const [wrongEmail, setWrongEmail] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //reset all errors
        setWrongPassword(false);
        setWrongEmail(false);

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
                if (response.status === 200) {
                    response.json()
                        .then(data => {
                            console.log(data);
                            localStorage.setItem("token",String(data.token))
                            window.location.replace(window.location.href); //Reload the page to access the real frontpage
                        })
                } else if (response.status === 400) {
                    setWrongEmail(true);
                } else if (403) {
                    setWrongPassword(true);
                } else {
                    console.log("Error in login")
                }
            })
    };

    return (
        <Container maxWidth="sm">
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
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
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};
 export default Login;
