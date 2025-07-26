// services/alertTrigger.js
const Subscription = require('../models/subscription');
const weatherService = require('../../../backend/services/weatherService');

async function checkAlertsAndTrigger() {
  const subscriptions = await Subscription.find({ isActive: true });

  for (const sub of subscriptions) {
    const city = sub.location.city;
    const alertType = sub.alertType.toLowerCase();

    try {
      const weather = await weatherService.getWeatherByCity(city);
      const currentConditions = weather.weather[0].main.toLowerCase();

      if (currentConditions.includes(alertType)) {
        console.log(`🚨 Alert triggered for ${sub.email} in ${city} - Condition: ${currentConditions}`);
        // Later: replace this with actual notification (email/SMS/etc.)
      } else {
        console.log(`✅ No alert for ${sub.email} in ${city} - Current: ${currentConditions}, Expecting: ${alertType}`);
      }

    } catch (err) {
      console.error(`Failed to get weather for ${city}:`, err.message);
    }
  }
}

module.exports = { checkAlertsAndTrigger };
