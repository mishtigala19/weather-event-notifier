const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});


// Basic Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Weather Event Notifier API',
        status: 'Server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Weather Event Notifier API Server running on port ${PORT}`);
});

module.exports = app;