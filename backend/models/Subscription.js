import mongoose from 'mongoose';

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
        match: [/^\+?[\d\s\-\(\)]{10,}$/ , 'Please enter a valid phone number']
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
        default: 'email',
        required: false
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
    },

    // Scheduler fields
    lastChecked: {
        type: Date, 
        default: null
    },

    timezone: {
        type: String, 
        default: 'America/New_York',
        required: false
    },

    checkInterval: {
        type: Number,
        default: 30, // check every 30 sec by default
        min: 15, // minimum 15 min
        max: 1400 // max once per day
    },

    alertCooldown:{
        type: Number,
        default: 60, // don't send same alert type more than once per hour
    },

    quietHours:{
        start: {
            type: String,
            default: '22:00' 
        },
        end: {
            type: String,
            default: '07:00'
        }
    }
});

// Indexing
subscriptionSchema.index({ email: 1 });
subscriptionSchema.index({ 'location.city': 1 });
subscriptionSchema.index({ isActive: 1 });
subscriptionSchema.index({ lastChecked: 1 });
subscriptionSchema.index({ timezone: 1 });

export default mongoose.model('Subscription', subscriptionSchema);