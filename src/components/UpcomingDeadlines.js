import React from 'react';
import { Typography, List, ListItem, ListItemText, ListItemIcon, Chip } from '@mui/material';
import { Event, Flag } from '@mui/icons-material';

const UpcomingDeadlines = ({ tasks }) => {
    const upcomingTasks = tasks
        .filter(task => task.dueDate && new Date(task.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);  // Show only the next 3 upcoming tasks

    const getPriorityColor = (status) => {
        switch(status.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'in progress':
                return 'warning';
            case 'todo':
            case 'pending':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <div>
            <Typography variant="h6" gutterBottom>Upcoming Deadlines</Typography>
            <List>
                {upcomingTasks.map((task) => (
                    <ListItem key={task._id}>
                        <ListItemIcon>
                            <Event />
                        </ListItemIcon>
                        <ListItemText
                            primary={task.title}
                            secondary={new Date(task.dueDate).toLocaleDateString()}
                        />
                        <Chip
                            icon={<Flag />}
                            label={task.status}
                            color={getPriorityColor(task.status)}
                            size="small"
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default UpcomingDeadlines;