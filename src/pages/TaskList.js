import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import {
    Container, Typography, Button, Box, Grid, Paper, useTheme, useMediaQuery,
    List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField,
    Chip, CircularProgress, Fade, Zoom, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Delete, Edit, Search, Clear, Add, FilterList } from '@mui/icons-material';
import toast from 'react-hot-toast';
import TaskForm from '../components/TaskForm';
import TaskCalendar from '../components/TaskCalendar';
import { useAuth } from '../context/AuthContext';
import socket from '../socket';

const API_URL = 'http://localhost:5000/api';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [filter, setFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
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

        socket.on('taskUpdated', handleTaskUpdate);
        socket.on('taskAdded', handleTaskAdd);
        socket.on('taskDeleted', handleTaskDelete);

        return () => {
            socket.off('taskUpdated', handleTaskUpdate);
            socket.off('taskAdded', handleTaskAdd);
            socket.off('taskDeleted', handleTaskDelete);
        };
    }, [fetchTasks]);

    const handleTaskUpdate = (updatedTask) => {
        setTasks(prevTasks => prevTasks.map(task =>
            task._id === updatedTask._id ? updatedTask : task
        ));
    };

    const handleTaskAdd = (newTask) => {
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    const handleTaskDelete = (deletedTaskId) => {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== deletedTaskId));
    };

    const handleDelete = async (id) => {
        setConfirmDelete(null);
        try {
            await axios.delete(`${API_URL}/tasks/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
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

    const onDragEnd = useCallback(async (result) => {
        if (!result.destination) return;

        const items = Array.from(tasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setTasks(items);

        try {
            await axios.put(`${API_URL}/tasks/reorder`, {
                taskId: reorderedItem._id,
                newIndex: result.destination.index
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
        } catch (error) {
            console.error('Error reordering task:', error);
            toast.error('Failed to reorder task. Please try again.');
        }
    }, [tasks, user.token]);

    const filteredTasks = tasks
        .filter(task => task.status.toLowerCase().includes(filter.toLowerCase()))
        .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));

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

    return (
        <Container maxWidth={isMobile ? "xs" : "xl"} sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                            Task Manager
                        </Typography>
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={4}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setShowForm(true)}
                                    startIcon={<Add />}
                                    fullWidth
                                >
                                    Add New Task
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    select
                                    label="Filter by Status"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    fullWidth
                                    SelectProps={{
                                        native: true,
                                    }}
                                    InputProps={{
                                        startAdornment: <FilterList sx={{ color: 'action.active', mr: 1 }} />,
                                    }}
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
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
                                        endAdornment: searchTerm && (
                                            <IconButton size="small" onClick={() => setSearchTerm('')}>
                                                <Clear />
                                            </IconButton>
                                        ),
                                    }}
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
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="tasks">
                                    {(provided) => (
                                        <List {...provided.droppableProps} ref={provided.innerRef}>
                                            {filteredTasks.map((task, index) => (
                                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                                    {(provided) => (
                                                        <Fade in={true}>
                                                            <ListItem
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
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
                                                                            <Typography variant="body2">
                                                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                                                            </Typography>
                                                                        </Box>
                                                                    }
                                                                />
                                                                <Chip
                                                                    label={task.status}
                                                                    color={getStatusColor(task.status)}
                                                                    size="small"
                                                                    sx={{ mr: 2 }}
                                                                />
                                                                <ListItemSecondaryAction>
                                                                    <IconButton onClick={() => handleEdit(task)} sx={{ mr: 1 }}>
                                                                        <Edit color="primary" />
                                                                    </IconButton>
                                                                    <IconButton onClick={() => setConfirmDelete(task._id)}>
                                                                        <Delete color="error" />
                                                                    </IconButton>
                                                                </ListItemSecondaryAction>
                                                            </ListItem>
                                                        </Fade>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </List>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        )}
                    </Paper>
                </Grid>
                {!isMobile && (
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                                Task Calendar
                            </Typography>
                            <TaskCalendar tasks={tasks} />
                        </Paper>
                    </Grid>
                )}
            </Grid>
            <Dialog
                open={Boolean(confirmDelete)}
                onClose={() => setConfirmDelete(null)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this task?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
                    <Button onClick={() => handleDelete(confirmDelete)} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TaskList;