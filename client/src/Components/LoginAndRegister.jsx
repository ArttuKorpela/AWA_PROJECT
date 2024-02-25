import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

import {Container, Button, Box} from '@mui/material';


const LoginAndRegister = () => {
    //Islogin is a state that is used to tell if the login component or register is shown
    const [isLogin, setIsLogin] = useState(true);

    return (
        <Router>
            <div>
                <Box
                    data-testid = "login-and-register"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh' // Adjust the height as needed, 100vh for full viewport height
                    }}
                >
                <Container maxWidth="sm" style={{ textAlign: "center" }}>
                    <Button
                        data-testid="top-login-button"
                        variant={isLogin ? "contained" : "outlined"}
                        onClick={() => setIsLogin(true)} //Pressing changes the view to include login component
                        style={{ marginRight: 10 }}
                    >
                        Login
                    </Button>
                    <Button
                        data-testid="register-button"
                        variant={!isLogin ? "contained" : "outlined"}
                        onClick={() => setIsLogin(false)} //Pressing changes the view to include register component
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