const express = require('express');
const weatherService = require('../services/weatherService');
const router = express.Router();
const mapWeatherCodeToAlert = require('../utils/mapWeatherCode');


/**
 * Test API connection
 * GET /api/weather/test
 */
router.get('/test', async (req, res) => {
  try {
    const result = await weatherService.testConnection();
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: result.testData
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during API test',
      error: error.message
    });
  }
});

/**
 * Get weather by city name
 * GET /api/weather/city/:cityName
 */
router.get('/city/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    
    // Basic validation
    if (!cityName || cityName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'City name must be at least 2 characters long'
      });
    }

    const weatherData = await weatherService.getWeatherByCity(cityName);
    const weatherCode = weatherData.weather[0].id;
    const alertType = mapWeatherCodeToAlert(weatherCode);

    
    res.json({
      success: true,
      message: `Weather data for ${cityName}`,
      data: weatherData,
      alert: alertType
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to fetch weather data',
      error: error.message
    });
  }
});

/**
 * Get weather by coordinates
 * GET /api/weather/coordinates/:lat/:lon
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

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: 'Latitude must be between -90 and 90 degrees.'
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Longitude must be between -180 and 180 degrees.'
      });
    }

    const weatherData = await weatherService.getWeatherByCoordinates(latitude, longitude);
    
    res.json({
      success: true,
      message: `Weather data for coordinates ${lat}, ${lon}`,
      data: weatherData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to fetch weather data',
      error: error.message
    });
  }
});

module.exports = router;

