require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const Task = require('./models/Task');
const auth = require('./middleware/authMiddleware');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', auth, taskRoutes);

app.get('/', (req, res) => {
    res.send('Task Management API is running');
});

app.get('/api/recent-tasks', auth, async (req, res) => {
    try {
        const recentTasks = await Task.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(5);
        res.json(recentTasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`MongoDB URI: ${process.env.MONGO_URI}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    app.close(() => {
        console.log('HTTP server closed');
    });
});