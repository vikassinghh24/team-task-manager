const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// @route   POST /api/tasks
// @desc    Create a task (Admin only logic can be added here)
router.post('/', auth, async (req, res) => {
  const { title, description, assignedTo, project, status } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      assignedTo, // ID of the Member
      project,    // ID of the Project
      status
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/tasks/:projectId
// @desc    Get all tasks for a specific project
router.get('/:projectId', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .sort({ date: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task status (Used by Members to track progress)
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;