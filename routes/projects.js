const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // This expects the direct function
const Project = require('../models/Project');

// This is Line 6 where it was crashing:
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied: Admins only' });
  }
  
  try {
    const newProject = new Project({
      name: req.body.name,
      description: req.body.description,
      admin: req.user.id
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find().populate('admin', 'name');
    res.json(projects);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;