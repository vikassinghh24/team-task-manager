const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@test.com' && password === 'password123') {
        return res.status(200).json({
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sandboxinterviewtoken"
        });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
});

app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server running');
});
