const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.log(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));


const PORT = process.env.PORT || 5000;
const path = require('path');

// 1. Serve the static files from the Vite/React frontend build folder
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// 2. Route any page requests (like /dashboard) to your frontend index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));