const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User'); // Queries your real MongoDB User model

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager')
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// 🔐 REAL DATABASE AUTHENTICATION ROUTE
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Database query login attempt for: ${email}`);

        // 1. Check if user exists in your real MongoDB collection
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid Email or Password' });
        }

        // 2. Direct database password string match
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid Email or Password' });
        }

        // 3. Send back the exact payload your React frontend expects to authorize the admin
        return res.status(200).json({
            success: true,
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.validinterviewsandboxauthtoken",
            user: { 
                id: user._id, 
                _id: user._id,
                email: user.email, 
                role: user.role || "admin",
                name: user.name || "Admin User"
            }
        });

    } catch (error) {
        console.error("Database Login Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// Serve Frontend Static Production Assets from Render
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Wildcard Route to serve index.html for Single Page Application (React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});