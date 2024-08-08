import React from 'react';
import { Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { Add, Edit, CheckCircle } from '@mui/icons-material';
import moment from 'moment';

const RecentActivity = ({ tasks }) => {
    const sortedTasks = [...tasks].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

    const getIcon = (status) => {
        switch(status.toLowerCase()) {
            case 'completed':
                return <CheckCircle />;
            case 'in progress':
                return <Edit />;
            default:
                return <Add />;
        }
    };

    return (
        <div>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            <List>
                {sortedTasks.map((task) => (
                    <ListItem key={task._id}>
                        <ListItemAvatar>
                            <Avatar>
                                {getIcon(task.status)}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={task.title}
                            secondary={`${task.status} - ${moment(task.updatedAt).fromNow()}`}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default RecentActivity;