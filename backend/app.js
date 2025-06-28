const express = require('express')
const app = express()

app.use(express.json())

const subscribers = []

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