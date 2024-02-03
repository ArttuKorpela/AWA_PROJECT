import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

import {Container, Button, Box} from '@mui/material';


const LoginAndRegister = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <Router>
            <div>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh' // Adjust the height as needed, 100vh for full viewport height
                    }}
                >
                <Container maxWidth="sm" style={{ textAlign: "center" }}>
                    <Button
                        variant={isLogin ? "contained" : "outlined"}
                        onClick={() => setIsLogin(true)}
                        style={{ marginRight: 10 }}
                    >
                        Login
                    </Button>
                    <Button
                        variant={!isLogin ? "contained" : "outlined"}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </Button>

                    {isLogin ? <Login /> : <Register onRegister={setIsLogin}/>}
                </Container>
                </Box>
            </div>
        </Router>
    );
};

export default LoginAndRegister;