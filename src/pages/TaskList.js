import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Container, Typography, List, ListItem, ListItemText,
    ListItemSecondaryAction, IconButton, Button, TextField,
    Chip, Grid, CircularProgress, Paper, Box, Divider,
    Fade, Zoom, useTheme, useMediaQuery
} from '@mui/material';
import { Delete, Edit, Search, Clear, Add, FilterList } from '@mui/icons-material';
import toast from 'react-hot-toast';
import TaskForm from '../components/TaskForm';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [filter, setFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchTasks = useCallback(async () => {
        if (!user || !user.token) {
            console.log('User not authenticated or token missing');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/tasks`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            console.log('Fetched tasks:', response.data);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error.response?.data || error.message);
            toast.error('Failed to fetch tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/tasks/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            await fetchTasks();
            toast.success('Task deleted successfully');
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task. Please try again.');
        }
    };

    const handleEdit = (task) => {
        setEditTask(task);
        setShowForm(true);
    };

    const handleFormSubmit = async (task) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            };

            if (editTask) {
                await axios.put(`${API_URL}/tasks/${editTask._id}`, task, config);
                toast.success('Task updated successfully');
            } else {
                await axios.post(`${API_URL}/tasks`, task, config);
                toast.success('Task added successfully');
            }
            await fetchTasks();
            setShowForm(false);
            setEditTask(null);
        } catch (error) {
            console.error('Error submitting task:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to submit task. Please try again.');
        }
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredTasks = tasks
        .filter(task => task.status.toLowerCase().includes(filter.toLowerCase()))
        .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Fade in={true}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        Task Manager
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={4}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setShowForm(true)}
                                startIcon={<Add />}
                                fullWidth
                                sx={{ height: '100%', borderRadius: 2 }}
                            >
                                Add New Task
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                select
                                label="Filter by Status"
                                value={filter}
                                onChange={handleFilterChange}
                                fullWidth
                                SelectProps={{
                                    native: true,
                                }}
                                InputProps={{
                                    startAdornment: <FilterList sx={{ color: 'action.active', mr: 1 }} />,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="in progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Search Tasks"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                fullWidth
                                InputProps={{
                                    startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
                                    endAdornment: searchTerm && (
                                        <IconButton size="small" onClick={() => setSearchTerm('')}>
                                            <Clear />
                                        </IconButton>
                                    ),
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                    </Grid>
                    {showForm && (
                        <Zoom in={showForm}>
                            <Box sx={{ mb: 3 }}>
                                <TaskForm
                                    onSubmit={handleFormSubmit}
                                    initialData={editTask}
                                    onCancel={() => {
                                        setShowForm(false);
                                        setEditTask(null);
                                    }}
                                />
                            </Box>
                        </Zoom>
                    )}
                    {loading ? (
                        <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <List>
                            {filteredTasks.map((task) => (
                                <Fade in={true} key={task._id}>
                                    <ListItem
                                        sx={{
                                            mb: 2,
                                            bgcolor: theme.palette.background.paper,
                                            borderRadius: 2,
                                            boxShadow: 1,
                                            '&:hover': { bgcolor: theme.palette.action.hover },
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                                                    {task.title}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        {task.description}
                                                    </Typography>
                                                    <Chip
                                                        label={task.status}
                                                        color={
                                                            task.status.toLowerCase() === 'completed' ? 'success' :
                                                                task.status.toLowerCase() === 'in progress' ? 'warning' :
                                                                    'default'
                                                        }
                                                        size="small"
                                                        sx={{ borderRadius: 1 }}
                                                    />
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton onClick={() => handleEdit(task)} sx={{ mr: 1 }}>
                                                <Edit color="primary" />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(task._id)}>
                                                <Delete color="error" />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </Fade>
                            ))}
                        </List>
                    )}
                </Paper>
            </Container>
        </Fade>
    );
};

export default TaskList;