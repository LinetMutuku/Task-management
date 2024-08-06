import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Grid, MenuItem, Paper, Typography,
    Chip, IconButton, Slider, Switch, FormControlLabel, Select
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AddCircle } from '@mui/icons-material';
import toast from 'react-hot-toast';
import '../style.css';

const TaskForm = ({ onSubmit, onCancel, initialData }) => {
    const statusOptions = ['pending', 'in progress', 'ToDo', 'completed'];

    const [task, setTask] = useState({
        title: '',
        description: '',
        status: 'pending',
        dueDate: null,
        priority: 2,
        tags: [],
        isRecurring: false
    });
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        if (initialData) {
            setTask(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setTask({ ...task, dueDate: date });
    };

    const handlePriorityChange = (event, newValue) => {
        setTask({ ...task, priority: newValue });
    };

    const handleTagAdd = () => {
        if (newTag && !task.tags.includes(newTag)) {
            setTask({ ...task, tags: [...task.tags, newTag] });
            setNewTag('');
        }
    };

    const handleTagDelete = (tagToDelete) => {
        setTask({ ...task, tags: task.tags.filter((tag) => tag !== tagToDelete) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!task.title.trim()) {
            toast.error('Title is required');
            return;
        }
        onSubmit(task);
    };

    return (
        <Paper elevation={3} className="task-form-paper">
            <Typography variant="h6" gutterBottom className="task-form-title">
                {initialData ? 'Edit Task' : 'Add New Task'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={task.title}
                            onChange={handleChange}
                            required
                            variant="outlined"
                            className="task-form-input"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={task.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            variant="outlined"
                            className="task-form-input"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Select
                            fullWidth
                            label="Status"
                            name="status"
                            value={task.status}
                            onChange={handleChange}
                            variant="outlined"
                            className="task-form-input"
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Due Date"
                                value={task.dueDate}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField {...params} fullWidth variant="outlined" className="task-form-input" />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography gutterBottom>Priority</Typography>
                        <Slider
                            value={task.priority}
                            onChange={handlePriorityChange}
                            aria-labelledby="priority-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={1}
                            max={5}
                            className="task-form-slider"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Add Tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            variant="outlined"
                            className="task-form-input"
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={handleTagAdd}>
                                        <AddCircle />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <div className="task-form-tags">
                            {task.tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => handleTagDelete(tag)}
                                    color="primary"
                                    className="task-form-tag"
                                />
                            ))}
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={task.isRecurring}
                                    onChange={(e) => setTask({ ...task, isRecurring: e.target.checked })}
                                    name="isRecurring"
                                    color="primary"
                                />
                            }
                            label="Recurring Task"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            className="task-form-submit-button"
                        >
                            {initialData ? 'Update Task' : 'Add Task'}
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            type="button"
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            className="task-form-cancel-button"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default TaskForm;