const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['pending', 'in progress', 'ToDo', 'completed'],
        default: 'pending'
    },
    dueDate: {
        type: Date
    },
    priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 2
    },
    tags: [{
        type: String
    }],
    isRecurring: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);