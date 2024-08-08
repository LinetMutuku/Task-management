import React from 'react';
import { Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Assignment, CheckCircle, HourglassEmpty } from '@mui/icons-material';

const TaskSummary = ({ tasks }) => {
    const taskSummary = {
        total: tasks.length,
        completed: tasks.filter(task => task.status.toLowerCase() === 'completed').length,
        inProgress: tasks.filter(task => task.status.toLowerCase() === 'in progress').length,
        pending: tasks.filter(task => task.status.toLowerCase() === 'pending' || task.status.toLowerCase() === 'todo').length
    };

    return (
        <div>
            <Typography variant="h6" gutterBottom>Task Summary</Typography>
            <List>
                <ListItem>
                    <ListItemIcon>
                        <Assignment />
                    </ListItemIcon>
                    <ListItemText primary={`Total Tasks: ${taskSummary.total}`} />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText primary={`Completed: ${taskSummary.completed}`} />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <HourglassEmpty color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={`In Progress: ${taskSummary.inProgress}`} />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <Assignment color="error" />
                    </ListItemIcon>
                    <ListItemText primary={`Pending/ToDo: ${taskSummary.pending}`} />
                </ListItem>
            </List>
        </div>
    );
};

export default TaskSummary;