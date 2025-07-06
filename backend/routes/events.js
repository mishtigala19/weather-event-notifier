const express = require('express');
const weatherService = require('../services/weatherService');
const eventDetector = require('../services/eventDetector');
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
        const eventSummary = eventDetector.getEventSummary(weatherData);

        res.json({
            success: true,
            message: 'Event detection for ${cityName}',
            data: {
                weather: weatherData,
                events: eventSummary
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to detect weather events',
            error: error.message
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
        const eventSummary = eventDetector.getEventSummary(weatherData);

        res.json({
            success: true,
            message: 'Event detection for coordinates ${lat}, ${lon}',
            data: {
                weather: weatherData,
                events: eventSummary
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Faled to detect weather events', 
            error: error.message
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
        const eventSummary = eventDetector.getEventSummary(weatherData);

        res.json({
            success: true,
            message: 'Event detection test completed',
            data: {
                weather: weatherData,
                events: eventSummary
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Event detection test failed',
            error: error.message
        });
    }
});

module.exports = router;