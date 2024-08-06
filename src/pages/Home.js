import React from 'react';
import { Container, Typography, Button, Box, Grid, Paper, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Assignment, CheckCircle, Timeline } from '@mui/icons-material';

const MotionContainer = motion(Container);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionPaper = motion(Paper);

const featureList = [
    { icon: <Assignment fontSize="large" />, title: 'Organize Tasks', description: 'Effortlessly manage and prioritize your to-dos' },
    { icon: <Timeline fontSize="large" />, title: 'Track Progress', description: 'Visualize your productivity and achievements' },
    { icon: <CheckCircle fontSize="large" />, title: 'Boost Efficiency', description: 'Streamline your workflow and accomplish more' },
];

const Home = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <MotionContainer
            maxWidth={isMobile ? "xs" : "md"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Box sx={{ my: isMobile ? 2 : 4, textAlign: 'center' }}>
                <MotionTypography
                    variant={isMobile ? "h3" : "h2"}
                    component="h1"
                    gutterBottom
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                >
                    Task Management Simplified
                </MotionTypography>
                <MotionTypography
                    variant={isMobile ? "body1" : "h5"}
                    color="textSecondary"
                    paragraph
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Boost your productivity with our intuitive and powerful task management system.
                    Organize, prioritize, and accomplish your goals with ease.
                </MotionTypography>
                <MotionButton
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/tasks"  // This should link to your TaskList page
                    size={isMobile ? "medium" : "large"}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Get Started
                </MotionButton>
            </Box>

            <Grid container spacing={isMobile ? 2 : 4} sx={{ mt: isMobile ? 2 : 4 }}>
                {featureList.map((feature, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <MotionPaper
                            elevation={3}
                            sx={{
                                p: isMobile ? 2 : 3,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ y: -5, boxShadow: 6 }}
                        >
                            {feature.icon}
                            <Typography variant={isMobile ? "subtitle1" : "h6"} component="h2" sx={{ mt: 2, mb: 1 }}>
                                {feature.title}
                            </Typography>
                            <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary" align="center">
                                {feature.description}
                            </Typography>
                        </MotionPaper>
                    </Grid>
                ))}
            </Grid>
        </MotionContainer>
    );
};

export default Home;