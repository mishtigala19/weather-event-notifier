import express from 'express';
import cors from 'cors';
import Subscription from './models/Subscription.js';

const app = express();
// function to validate time zones
function isValidTimeZone(tz) {
    try {
        return Intl.supportedValuesOf
            ? Intl.supportedValuesOf('timeZone').includes(tz)
            : !!Intl.DateTimeFormat(undefined, { timeZone: tz });
    } catch {
        return false;
    }
}

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        /\.vercel\.app$/  // allow any *.vercel.app preview/prod
    ],
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
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

//to validate email and phone number
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9]{10,15}$/;

app.get('/trigger', async (_req, res) => {
    const count = await Subscription.countDocuments({ isActive: true });
    res.json({ message: `Notifications triggered for ${subscribers.length} subscribers.`, count })
});

app.post('/subscribe', async (req, res) => {
    const { email, phone, timeZone } = req.body;
    const errors = [];

    if (!email || !emailRegex.test(email)) {
        errors.push('Invalid email address');
    }

    if (phone && !phoneRegex.test(phone)) {
        errors.push('Invalid phone number');
    }

    if (!timeZone || typeof timeZone !== 'string' || !isValidTimeZone(timeZone)) {
        errors.push('Invalid or missing timeZone');
    }

    if (errors.length) {
        return res.status(400).json({ errors });
    }

    try {
        const payload = {...req.body, timezone: tz };
        delete payload.timeZone;
        const subscription = await Subscription.create(payload);
        res.status(201).json({ message: 'Subscription saved!', subscription });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/status', async (req, res) => {
    try {
        const count = await Subscription.countDocuments({ isActive: true });
        res.json({ uptime: `${process.uptime().toFixed(2)} seconds`, activeSubscribers: count, serverTime: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch subscriber count' });
    }
});

export default app;