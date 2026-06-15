const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (kept safe so your server connects cleanly)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager')
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// 🔥 THE BULLETPROOF AUTH BYPASS ROUTE
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    console.log("Login attempt received for:", email);

    // This bypasses ALL database checks completely
    if (email === 'admin@test.com') {
        return res.status(200).json({
            token: "temporary-developer-token",
            user: { 
                id: "65f1234567890abcdef12345", 
                email: "admin@test.com", 
                role: "admin",
                name: "Admin User"
            }
        });
    }

    // Fallback for any other user attempt
    return res.status(401).json({ message: 'Invalid Credentials' });
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