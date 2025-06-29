const express = require('express')
const app = express()
const cors = require('cors');

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

// Error Handling Middleware
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON' });
    }
    next();
});

const subscribers = []

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Weather Event Notifier API',
        status: 'Server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

app.post('/subscribe', (req, res) => {
    const { username, email, phone } = req.body
    if (!username || !email || !phone) {
        return res.status(400).json({ error: 'Username, email, and phone are all required' })
    }
    // Email format check
    const emailPattern = /^[^@]+@[^@]+\.[^@]+$/
    if (!emailPattern.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' })
    }
    // Phone format check: country code and number
    const phonePattern = /^\+\d{1,4}\s?\d{4,14}$/
    if (!phonePattern.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format' })
    }
    subscribers.push({ username, email, phone, subscribedAt: new Date() })
    res.status(201).json({ message: `Thanks for subscribing, ${username}!` })
})

app.get('/trigger', (req, res) => {
    res.json({ message: `Notifications triggered for ${subscribers.length} subscribers.` })
})

app.get('/status', (req, res) => {
    res.json({
        uptime: `${process.uptime().toFixed(2)} seconds`,
        activeSubscribers: subscribers.length,
        serverTime: new Date().toISOString()
    })
})

module.exports = app