const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true,
    trim: true
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
  dueDate: { 
    type: Date, 
    default: null 
  },
  category: { 
    type: String, 
    default: 'None',
    enum: ['None', 'Work', 'Personal', 'Shopping', 'Health', 'Education']
  },
  priority: {
    type: String,
    default: 'Medium',
    enum: ['Low', 'Medium', 'High']
  },
  description: {
    type: String,
    default: ''
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt
});

// Index for better query performance
taskSchema.index({ completed: 1, dueDate: 1 });
taskSchema.index({ category: 1 });

module.exports = mongoose.model('Task', taskSchema); 