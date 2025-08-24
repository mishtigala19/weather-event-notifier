import 'dotenv/config.js';
import app from './app.js';
import connectDB from './config/database.js';
import WeatherScheduler from './services/scheduler.js';
import subscriptionRoutes from './routes/subscription.js';
import weatherRoutes from './routes/weather.js';
import eventRoutes from './routes/events.js';
import weatherService from './services/weatherService.js';

const PORT = process.env.PORT || 5001;

// Connecting to MongoDB
connectDB();

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Enhanced server startup with weather API validation
app.listen(PORT, async () => {
    console.log(`🚀 Weather Event Notifier API Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🌤️ Weather API: http://localhost:${PORT}/api/weather/test`);
    
    // Test weather service on startup
    try {
        const testResult = await weatherService.testConnection();
        
        if (testResult.success) {
            console.log('✅ OpenWeatherMap API connection verified');
            console.log(`🌡️ Test data: ${testResult.testData.city} - ${testResult.testData.temperature}°C`);

            // Start weather scheduling after API successful connection
            console.log('🕐 Starting weather alert scheduler...');
            const scheduler = new WeatherScheduler();
            scheduler.startPeriodicChecks();
            console.log('✅ Weather Scheduler started - checking every 30 minutes.');
        } else {
            console.log('⚠️ OpenWeatherMap API connection failed:', testResult.error);
            console.log('📝 Server will continue running, but weather features may not work');
            console.log('⚠️ Scheduler not started due to API connection failure.')
        }
    } catch (error) {
        console.log('⚠️ Weather service initialization failed:', error.message);
        console.log('📝 Make sure to create services/weatherService.js and add OPENWEATHER_API_KEY to .env');
        console.log('⚠️ Scheduler not started due to weather service failure.')
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
    console.log('⏰ Scheduler Features:');
    console.log(`   Automatic weather checks every 30 minutes`);
    console.log(`   Smart alert cooldowns to prevent spam`);
    console.log(`   Timezone-aware notifications`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}); 