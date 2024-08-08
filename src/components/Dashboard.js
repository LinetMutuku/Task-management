import React from 'react';
import { Grid, Paper } from '@mui/material';
import TaskSummary from './TaskSummary';
import UpcomingDeadlines from './UpcomingDeadlines';
import RecentActivity from './RecentActivity';

const Dashboard = ({ tasks }) => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <TaskSummary tasks={tasks} />
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <UpcomingDeadlines tasks={tasks} />
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <RecentActivity tasks={tasks} />
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Dashboard;