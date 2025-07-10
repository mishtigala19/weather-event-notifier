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

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Weather Event Notifier API',
        status: 'Server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

const Subscription = require('./models/Subscription')

app.post('/subscribe', async (req, res) => {
    try {
        const subscription = await Subscription.create(req.body);
        res.status(201).json({ message: 'Subscription saved!', subscription });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/trigger', (req, res) => {
    res.json({ message: `Notifications triggered for ${subscribers.length} subscribers.` })
});

app.get('/status', async (req, res) => {
    try {
        const count = await Subscription.countDocuments({ isActive: true });
        res.json({ uptime: `${process.uptime().toFixed(2)} seconds`, activeSubscribers: count, serverTime: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch subscriber count' });
    }
});

module.exports = app