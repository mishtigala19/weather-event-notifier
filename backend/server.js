require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const subscriptionRoutes = require('./routes/subscription');


const PORT = process.env.PORT || 5001;

// Connecting to MongoDB
connectDB();

// Import and use weather routes
const weatherRoutes = require('./routes/weather');
app.use('/api/weather', weatherRoutes);

// Import and use event routes
const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);

app.use('/api/subscription', subscriptionRoutes);

// Enhanced server startup with weather API validation
app.listen(PORT, async () => {
    console.log(`🚀 Weather Event Notifier API Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🌤️ Weather API: http://localhost:${PORT}/api/weather/test`);
    
    // Test weather service on startup
    try {
        const weatherService = require('./services/weatherService');
        const testResult = await weatherService.testConnection();
        
        if (testResult.success) {
            console.log('✅ OpenWeatherMap API connection verified');
            console.log(`🌡️ Test data: ${testResult.testData.city} - ${testResult.testData.temperature}°C`);
        } else {
            console.log('⚠️ OpenWeatherMap API connection failed:', testResult.error);
            console.log('📝 Server will continue running, but weather features may not work');
        }
    } catch (error) {
        console.log('⚠️ Weather service initialization failed:', error.message);
        console.log('📝 Make sure to create services/weatherService.js and add OPENWEATHER_API_KEY to .env');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 Available Weather API Endpoints:');
    console.log(`   GET  /api/weather/test - Test API connection`);
    console.log(`   GET  /api/weather/city/:cityName - Get weather by city`);
    console.log(`   GET  /api/weather/coordinates/:lat/:lon - Get weather by coordinates`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Database & Subscription Features:');
    console.log(`   POST /subscribe - Create new subscription (MongoDB)`);
    console.log(`   GET  /subscribers - Get all subscribers`);
    console.log(`   GET  /status - Server status with DB subscriber count`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}); 