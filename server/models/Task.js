// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },

  description: {
    type: String,
    maxlength: 1000
  },
  
  status: {
    type: String,
    enum: ['todo', 'inProgress', 'done'],
    default: 'todo',
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
