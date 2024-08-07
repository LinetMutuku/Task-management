import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home as HomeIcon, Assignment as TaskIcon, ExitToApp as LogoutIcon, Login as LoginIcon, PersonAdd as RegisterIcon } from '@mui/icons-material';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <AppBar position="static" sx={{
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 'bold',
                            letterSpacing: '1px',
                        }}
                    >
                        <RouterLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
                            TaskMaster
                        </RouterLink>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            component={RouterLink}
                            to="/"
                            startIcon={<HomeIcon />}
                            sx={{
                                color: 'white',
                                margin: '0 8px',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            Home
                        </Button>
                        {user ? (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/tasks"
                                    startIcon={<TaskIcon />}
                                    sx={{
                                        color: 'white',
                                        margin: '0 8px',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        },
                                    }}
                                >
                                    Tasks
                                </Button>
                                <Button
                                    onClick={logout}
                                    startIcon={<LogoutIcon />}
                                    sx={{
                                        color: 'white',
                                        margin: '0 8px',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        },
                                    }}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    startIcon={<LoginIcon />}
                                    sx={{
                                        color: 'white',
                                        margin: '0 8px',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        },
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    startIcon={<RegisterIcon />}
                                    sx={{
                                        color: 'white',
                                        margin: '0 8px',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        },
                                    }}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;