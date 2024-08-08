import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Paper, Typography, useTheme } from '@mui/material';

const localizer = momentLocalizer(moment);

const TaskCalendar = ({ tasks }) => {
    const theme = useTheme();

    const events = tasks.map(task => ({
        id: task._id,
        title: task.title,
        start: new Date(task.startDate || task.createdAt),
        end: new Date(task.dueDate || moment(task.startDate || task.createdAt).add(1, 'days')),
        allDay: true,
        resource: task.status,
    }));

    const eventStyleGetter = (event) => {
        let backgroundColor = theme.palette.primary.main;
        if (event.resource.toLowerCase() === 'completed') {
            backgroundColor = theme.palette.success.main;
        } else if (event.resource.toLowerCase() === 'in progress') {
            backgroundColor = theme.palette.warning.main;
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    return (
        <Paper elevation={3} sx={{ p: 2, height: '500px' }}>
            <Typography variant="h6" gutterBottom>Task Calendar</Typography>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                eventPropGetter={eventStyleGetter}
            />
        </Paper>
    );
};

export default TaskCalendar;