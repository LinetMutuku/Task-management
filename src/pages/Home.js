import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Typography, Button, Box, Grid, Paper, useTheme, useMediaQuery,
    List, ListItem, ListItemIcon, ListItemText, Badge, CircularProgress, Chip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Assignment, CheckCircle, Timeline, Task, DateRange, Notifications, Flag
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import socket from '../socket';

const MotionContainer = motion(Container);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionPaper = motion(Paper);

const featureList = [
    { icon: <Assignment fontSize="large" />, title: 'Organize Tasks', description: 'Effortlessly manage and prioritize your to-dos' },
    { icon: <Timeline fontSize="large" />, title: 'Track Progress', description: 'Visualize your productivity and achievements' },
    { icon: <CheckCircle fontSize="large" />, title: 'Boost Efficiency', description: 'Streamline your workflow and accomplish more' },
];

const API_URL = 'http://localhost:5000/api';

const Home = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [tasks, setTasks] = useState([]);
    const [dashboardItems, setDashboardItems] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`${API_URL}/tasks`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setTasks(response.data);
                updateDashboardItems(response.data);
                generateNotifications(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.token) {
            fetchTasks();
        }

        // Set up socket listeners
        socket.on('taskUpdated', handleTaskUpdate);
        socket.on('taskAdded', handleTaskAdd);
        socket.on('taskDeleted', handleTaskDelete);

        return () => {
            socket.off('taskUpdated', handleTaskUpdate);
            socket.off('taskAdded', handleTaskAdd);
            socket.off('taskDeleted', handleTaskDelete);
        };
    }, [user]);

    const handleTaskUpdate = (updatedTask) => {
        setTasks(prevTasks => {
            const newTasks = prevTasks.map(task =>
                task._id === updatedTask._id ? updatedTask : task
            );
            updateDashboardItems(newTasks);
            generateNotifications(newTasks);
            return newTasks;
        });
    };

    const handleTaskAdd = (newTask) => {
        setTasks(prevTasks => {
            const newTasks = [...prevTasks, newTask];
            updateDashboardItems(newTasks);
            generateNotifications(newTasks);
            return newTasks;
        });
    };

    const handleTaskDelete = (deletedTaskId) => {
        setTasks(prevTasks => {
            const newTasks = prevTasks.filter(task => task._id !== deletedTaskId);
            updateDashboardItems(newTasks);
            generateNotifications(newTasks);
            return newTasks;
        });
    };

    const updateDashboardItems = (tasks) => {
        const now = new Date();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status.toLowerCase() === 'completed').length;
        const upcomingTasks = tasks.filter(task =>
            task.status.toLowerCase() !== 'completed' &&
            new Date(task.dueDate) > now
        ).length;

        setDashboardItems([
            { icon: <Task fontSize="large" />, title: 'Total Tasks', value: totalTasks.toString() },
            { icon: <CheckCircle fontSize="large" />, title: 'Completed', value: completedTasks.toString() },
            { icon: <DateRange fontSize="large" />, title: 'Upcoming', value: upcomingTasks.toString() },
        ]);
    };

    const generateNotifications = (tasks) => {
        const newNotifications = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        tasks.forEach(task => {
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            if (dueDate.getTime() === today.getTime()) {
                newNotifications.push({
                    id: task._id,
                    message: `Task "${task.title}" is due today`,
                    isNew: true,
                    dueDate: task.dueDate,
                    status: task.status
                });
            } else if (dueDate.getTime() === tomorrow.getTime()) {
                newNotifications.push({
                    id: task._id,
                    message: `Task "${task.title}" is due tomorrow`,
                    isNew: true,
                    dueDate: task.dueDate,
                    status: task.status
                });
            }
        });

        setNotifications(newNotifications.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
    };

    const newNotificationsCount = notifications.filter(n => n.isNew).length;

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'in progress':
                return 'warning';
            default:
                return 'error';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <MotionContainer
            maxWidth="lg"
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
                    to="/tasks"
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

            <Box sx={{ mt: 6, mb: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom align="center">
                    Dashboard Overview
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    {dashboardItems.map((item, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                            <MotionPaper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ y: -5, boxShadow: 6 }}
                            >
                                {item.icon}
                                <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                                    {item.title}
                                </Typography>
                                <Typography variant="h4" component="p" sx={{ mt: 1, fontWeight: 'bold' }}>
                                    {item.value}
                                </Typography>
                            </MotionPaper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box sx={{ mt: 6, mb: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom align="center">
                    <Badge badgeContent={newNotificationsCount} color="secondary">
                        <Notifications sx={{ mr: 1 }} />
                    </Badge>
                    Upcoming Tasks
                </Typography>
                <MotionPaper
                    elevation={3}
                    sx={{ p: 3, maxHeight: 300, overflow: 'auto' }}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <List>
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <ListItem key={notification.id} sx={{ py: 1 }}>
                                    <ListItemIcon>
                                        <Assignment color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={notification.message}
                                        secondary={new Date(notification.dueDate).toLocaleDateString()}
                                    />
                                    <Chip
                                        icon={<Flag />}
                                        label={notification.status}
                                        color={getStatusColor(notification.status)}
                                        size="small"
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No upcoming tasks." />
                            </ListItem>
                        )}
                    </List>
                </MotionPaper>
            </Box>

            <Box sx={{ mt: 6, mb: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom align="center">
                    Recent Tasks
                </Typography>
                <MotionPaper
                    elevation={3}
                    sx={{ p: 3, maxHeight: 300, overflow: 'auto' }}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <List>
                        {tasks.length > 0 ? (
                            tasks.slice(0, 5).map((task) => (
                                <ListItem key={task._id} sx={{ py: 1 }}>
                                    <ListItemIcon>
                                        <Assignment color={getStatusColor(task.status)} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={task.title}
                                        secondary={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                                    />
                                    <Chip
                                        label={task.status}
                                        color={getStatusColor(task.status)}
                                        size="small"
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="No tasks available." />
                            </ListItem>
                        )}
                    </List>
                </MotionPaper>
            </Box>

            <Box sx={{ mt: 6, mb: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom align="center">
                    Key Features
                </Typography>
                <Grid container spacing={isMobile ? 2 : 4}>
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
                                <Typography variant={isMobile ? "subtitle1" : "h6"} component="h3" sx={{ mt: 2, mb: 1 }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary" align="center">
                                    {feature.description}
                                </Typography>
                            </MotionPaper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </MotionContainer>
    );
};

export default Home;