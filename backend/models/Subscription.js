const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    // User's contact info
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    phone: {
        type: String,
        required: false,
        trim: true,
        match: [/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number']
    },

    // Location info
    location: {
        city: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            required: false,
            trim: true
        },
        coordinates: {
            lat: Number,
            lon: Number
        }
    },

    // Alert methods and preferences
    alertTypes: [{
        type: String,
        enum: ['rain', 'heat', 'storm', 'snow', 'wind']
    }],

    notificationMethods: [{
        type: String,
        enum: ['email', 'sms'],
        required: true
    }],

    frequency: {
        type: String,
        enum: ['once', 'daily', 'weekly'],
        default: 'once'
    }, 

    thresholds: {
        temperature: {
            min: Number, 
            max: Number
        }, 
        windSpeed: Number, 
        precipitation: Number
    }, 

    // Subscription status
    isActive: {
        type: Boolean,
        default: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    lastNotified: {
        type: Date,
        default: null
    }
});

// Indexing
subscriptionSchema.index({ email: 1 });
subscriptionSchema.index({ 'location.city': 1 });
subscriptionSchema.index({ isActive: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);