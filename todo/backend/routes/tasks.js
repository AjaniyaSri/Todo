const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksByCategory,
  getTasksByStatus,
  getTaskStats
} = require('../controllers/taskController');

// Specific routes must come before parameterized routes
router.get('/category/:category', getTasksByCategory);
router.get('/status/:status', getTasksByStatus);
router.get('/stats/overview', getTaskStats);

// Main CRUD routes
router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router; 