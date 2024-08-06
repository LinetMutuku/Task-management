const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, description, status, dueDate, priority, tags, isRecurring } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const newTask = new Task({
            title,
            description,
            status,
            dueDate,
            priority,
            tags,
            isRecurring,
            user: req.user.id
        });

        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        console.error('Error creating task:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: err.errors });
        }
        res.status(500).json({ message: 'Error creating task', error: err.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { title, description, status, dueDate, priority, tags, isRecurring } = req.body;

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, description, status, dueDate, priority, tags, isRecurring },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        console.error('Error updating task:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: err.errors });
        }
        res.status(500).json({ message: 'Error updating task', error: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task removed successfully' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
};