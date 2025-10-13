import axios from 'axios';
import 'dotenv/config';

class WeatherService {
  constructor() {
    // Get API key from environment variables
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';
    
    // Validate API key exists
    if (!this.apiKey) {
      throw new Error('OPENWEATHER_API_KEY is required in environment variables');
    }

    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000, // 10 second timeout
      params: {
        appid: this.apiKey,
        units: 'metric' // Use Celsius
      }
    });

    console.log('✅ WeatherService initialized successfully');
  }

  /**
   * Test the API connection
   * @returns {Promise<Object>} API status and test result
   */
  async testConnection() {
    try {
      console.log('🔍 Testing OpenWeatherMap API connection...');
      
      const response = await this.client.get('/weather', {
        params: { q: 'London' }
      });

      console.log('✅ API Connection successful!');
      return {
        success: true,
        message: 'Connected to OpenWeatherMap API',
        testData: {
          city: response.data.name,
          temperature: response.data.main.temp,
          description: response.data.weather[0].description
        }
      };
    } catch (error) {
      console.error('❌ API Connection failed:', error.message);
      return {
        success: false,
        message: 'Failed to connect to OpenWeatherMap API',
        error: this.handleError(error)
      };
    }
  }

  /**
   * Get current weather by city name
   * @param {string} city - City name (e.g., "Boston", "New York")
   * @returns {Promise<Object>} Weather data
   */
  async getWeatherByCity(city) {
    try {
      console.log(`🌤️ Fetching weather for: ${city}`);
      
      const response = await this.client.get('/weather', {
        params: { q: city }
      });

      return this.formatWeatherData(response.data);
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * Get current weather by coordinates
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>} Weather data
   */
  async getWeatherByCoordinates(lat, lon) {
    try {
      console.log(`🌤️ Fetching weather for coordinates: ${lat}, ${lon}`);
      
      const response = await this.client.get('/weather', {
        params: { lat, lon }
      });

      return this.formatWeatherData(response.data);
    } catch (error) {
      throw new Error(this.handleError(error));
    }
  }

  /**
   * Format raw weather data into consistent structure
   * @param {Object} data - Raw API response
   * @returns {Object} Formatted weather data
   */
  formatWeatherData(data) {
    return {
      location: {
        name: data.name,
        country: data.sys.country,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon
        }
      },
      current: {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: data.weather[0].description,
        main: data.weather[0].main,
        icon: data.weather[0].icon,
        windSpeed: data.wind?.speed || 0,
        code: data.weather[0].id
      },
      timestamp: new Date().toISOString(),
      source: 'OpenWeatherMap'
    };
  }

  /**
   * Handle API errors with user-friendly messages
   * @param {Error} error - Axios error object
   * @returns {string} User-friendly error message
   */
  handleError(error) {
    if (error.response) {
      // API responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return 'Invalid API key. Please check your OpenWeatherMap credentials.';
        case 404:
          return 'Location not found. Please check the city name or coordinates.';
        case 429:
          return 'API rate limit exceeded. Please try again later.';
        case 400:
          return `Invalid request: ${data.message || 'Bad request'}`;
        default:
          return `API Error (${status}): ${data.message || 'Unknown error'}`;
      }
    } else if (error.request) {
      // Network error
      return 'Network error: Unable to reach OpenWeatherMap API. Check your internet connection.';
    } else {
      // Request setup error
      return `Request error: ${error.message}`;
    }
  }
}

export default new WeatherService();