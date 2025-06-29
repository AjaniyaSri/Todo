const Task = require('../models/Task');
const mongoose = require('mongoose');

// In-memory fallback storage for when MongoDB is not available
let inMemoryTasks = [];
let nextId = 1;

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const tasks = await Task.find().sort({ createdAt: -1 });
      res.json(tasks);
    } else {
      // Use in-memory storage as fallback
      res.json(inMemoryTasks);
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Fallback to in-memory storage
    res.json(inMemoryTasks);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
const getTask = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } else {
      // Use in-memory storage as fallback
      const task = inMemoryTasks.find(t => t.id === parseInt(req.params.id));
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    }
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
  try {
    const { text, completed, dueDate, category, priority, description } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Task text is required' });
    }

    if (isMongoConnected()) {
      const task = new Task({
        text: text.trim(),
        completed: completed || false,
        dueDate: dueDate || null,
        category: category || 'None',
        priority: priority || 'Medium',
        description: description || ''
      });

      const newTask = await task.save();
      res.status(201).json(newTask);
    } else {
      // Use in-memory storage as fallback
      const newTask = {
        id: nextId++,
        text: text.trim(),
        completed: completed || false,
        dueDate: dueDate || null,
        category: category || 'None',
        priority: priority || 'Medium',
        description: description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      inMemoryTasks.push(newTask);
      res.status(201).json(newTask);
    }
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ message: 'Invalid task data' });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
  try {
    const { text, completed, dueDate, category, priority, description } = req.body;

    if (isMongoConnected()) {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Update fields if provided
      if (text !== undefined) task.text = text.trim();
      if (completed !== undefined) task.completed = completed;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (category !== undefined) task.category = category;
      if (priority !== undefined) task.priority = priority;
      if (description !== undefined) task.description = description;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      // Use in-memory storage as fallback
      const taskIndex = inMemoryTasks.findIndex(t => t.id === parseInt(req.params.id));
      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const task = inMemoryTasks[taskIndex];
      if (text !== undefined) task.text = text.trim();
      if (completed !== undefined) task.completed = completed;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (category !== undefined) task.category = category;
      if (priority !== undefined) task.priority = priority;
      if (description !== undefined) task.description = description;
      task.updatedAt = new Date().toISOString();

      res.json(task);
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ message: 'Invalid task data' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      await task.deleteOne();
      res.json({ message: 'Task deleted successfully' });
    } else {
      // Use in-memory storage as fallback
      const taskIndex = inMemoryTasks.findIndex(t => t.id === parseInt(req.params.id));
      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
      }

      inMemoryTasks.splice(taskIndex, 1);
      res.json({ message: 'Task deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get tasks by category
// @route   GET /api/tasks/category/:category
// @access  Public
const getTasksByCategory = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const tasks = await Task.find({ category: req.params.category }).sort({ createdAt: -1 });
      res.json(tasks);
    } else {
      // Use in-memory storage as fallback
      const tasks = inMemoryTasks.filter(t => t.category === req.params.category);
      res.json(tasks);
    }
  } catch (error) {
    console.error('Error fetching tasks by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get tasks by status (completed/incomplete)
// @route   GET /api/tasks/status/:status
// @access  Public
const getTasksByStatus = async (req, res) => {
  try {
    const status = req.params.status === 'completed';
    if (isMongoConnected()) {
      const tasks = await Task.find({ completed: status }).sort({ createdAt: -1 });
      res.json(tasks);
    } else {
      // Use in-memory storage as fallback
      const tasks = inMemoryTasks.filter(t => t.completed === status);
      res.json(tasks);
    }
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Public
const getTaskStats = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const total = await Task.countDocuments();
      const completed = await Task.countDocuments({ completed: true });
      const active = await Task.countDocuments({ completed: false });
      const overdue = await Task.countDocuments({
        completed: false,
        dueDate: { $lt: new Date() }
      });

      res.json({
        total,
        completed,
        active,
        overdue,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    } else {
      // Use in-memory storage as fallback
      const total = inMemoryTasks.length;
      const completed = inMemoryTasks.filter(t => t.completed).length;
      const active = inMemoryTasks.filter(t => !t.completed).length;
      const overdue = inMemoryTasks.filter(t => 
        !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
      ).length;

      res.json({
        total,
        completed,
        active,
        overdue,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    }
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksByCategory,
  getTasksByStatus,
  getTaskStats
}; 