import express from 'express';
import weatherService from '../services/weatherService.js';
import eventDetector from '../services/eventDetector.js';
import Subscription from '../models/Subscription.js';
import { sendSMS } from '../services/smsService.js';
import { sendEmailAlert } from '../services/emailService.js';

const router = express.Router();

/**
 * Detect weather events for a city
 * GET /api/events/city/:cityName
 */

router.get('/city/:cityName', async (req, res) => {
    try {
        const { cityName } = req.params;

        // Validate cities
        if (!cityName || cityName.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'City name must be at least 2 characters long'
            });
        }

        // Get weather data
        const weatherData = await weatherService.getWeatherByCity(cityName);

        // Detect events
        const eventSummary = eventDetector.detectEvents ? eventDetector.detectEvents(weatherData) : eventDetector.getEventSummary(weatherData);

        // Notify subscribers if events are detected
        if (Array.isArray(eventSummary) && eventSummary.length) {
            await notifySubscribers(cityName, eventSummary, weatherData);
        }

        res.json({
            success: true,
            message: `Event detection for ${cityName}`,
            data: {
                weather: weatherData,
                events: eventSummary
            }
        });
    } catch (err) {
        console.error('Error detecting city events:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to detect weather events',
            error: err.message
        });
    }
});

/**
 * Detect weather events for coordinates
 * GET /api/events/coordinates/:lat/:lon
 */

router.get('/coordinates/:lat/:lon', async (req, res) => {
    try {
        const { lat, lon } = req.params;

        // Validate coordinates
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coordinates. Latitude and longitude must be numbers.'
            });
        }

        // Get weather data
        const weatherData = await weatherService.getWeatherByCoordinates(latitude, longitude);

        // Detect events
        const eventSummary = eventDetector.detectEvents ? eventDetector.detectEvents(weatherData) : eventDetector.getEventSummary(weatherData);

        // Notify subscribers if events are detected
        if (eventSummary && eventSummary.length > 0) {
            const cityName = weatherData.name || `${latitude},${longitude}`;
            await notifySubscribers(cityName, eventSummary, weatherData);
        }

        res.json({
            success: true,
            message: `Event detection for coordinates ${lat}, ${lon}`,
            data: {
                weather: weatherData,
                events: eventSummary
            }
        });
    } catch (err) {
        console.error('Error detecting city events:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to detect weather events', 
            error: err.message
        });
    }
});

/**
 * Test event detection with sample data
 * GET /api/events/test
 */

router.get('/test', async (req, res) => {
    try {
        // Getting weather data for test city
        const weatherData = await weatherService.getWeatherByCity('Phoenix'); // warm/hot city

        // Detect events
        const eventSummary = eventDetector.detectEvents ? eventDetector.detectEvents(weatherData) : eventDetector.getEventSummary(weatherData);

        res.json({
            success: true,
            message: 'Event detection test completed',
            data: {
                weather: weatherData,
                events: eventSummary
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Event detection test failed',
            error: err.message
        });
    }
});

/**
 * Test email functionality
 * GET /api/events/test-email
 */

router.get('/test-email', async (req, res) => {
    try {
        await sendEmailAlert(
            'test@example.com', // Replace with your email for testing
            'Test Weather Alert',
            'Rain Alert',
            {
                weather: [{ description: 'light rain' }],
                main: { temp: 298.55 },
                name: 'Boston'
            },
            'Boston',
            `${process.env.BASE_URL || 'https://localhost:5001'}/api/subscription/test/unsubscribe`
        );
        
        res.json({
            success: true,
            message: 'Test email sent',
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to send test email',
            details: err.message
        });
    }
});

/**
 * Notify both SMS and Email subscribers in MongoDB whose
 * city matches and who have opted into the event type.
 */

async function notifySubscribers(cityName, detectedEvents, weatherData) {
    try {
        // Find all active subscribers for this city
        const subs = await Subscription.find({
            'location.city': { $regex: new RegExp(cityName, 'i') }, // Case-insensitive city matching
            isActive: true
        });

        console.log(`Found ${subs.length} subscribers for ${cityName}`);

        for (const subscriber of subs) {
            for (const event of detectedEvents) {
                // Check if subscriber is interested in this event type
                if (subscriber.alertTypes.includes(event.type)) {
                    const unsubLink = `${process.env.BASE_URL || 'http://localhost:5001'}/api/subscription/${subscriber._id}/unsubscribe`;

                    // Send SMS if subscriber prefers SMS
                    if (subscriber.notificationMethods.includes('sms') && subscriber.phone) {
                        const smsMessage = `Weather alert for ${cityName}: ${event.title} - ${event.description}. Unsubscribe: ${unsubLink}`;

                        try {
                            await sendSMS(subscriber.phone, smsMessage);
                            console.log(`SMS sent to ${subscriber.phone} for ${event.type}`);
                        } catch (smsErr) {
                            console.error(`Failed to send SMS to ${subscriber.phone}:`, smsErr.message);
                        }
                    }

                    // Send Email if subscriber prefers email
                    if (subscriber.notificationMethods.includes('email') && subscriber.email) {
                        const subject = `${event.title} - ${cityName}`;
                        
                        try {
                            await sendEmailAlert(
                                subscriber.email,
                                subject,
                                event.title,
                                weatherData,
                                cityName,
                                unsubLink
                            );
                            console.log(`Email sent to ${subscriber.email} for ${event.type}`);
                        } catch (emailError) {
                            console.error(`Failed to send email to ${subscriber.email}:`, emailError.message);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error notifying subscribers:', error);
    }
}

export default router;