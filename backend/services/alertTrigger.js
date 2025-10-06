// services/alertTrigger.js
import Subscription from '../models/Subscription.js';
import weatherService from '../backend/services/weatherService.js';

export async function checkAlertsAndTrigger() {
  const subscriptions = await Subscription.find({ isActive: true });

  for (const sub of subscriptions) {
    const city = sub.location?.city;
    const alertType = (sub.alertTypes || []).map(t => t.toLowerCase());

    try {
      const weather = await weatherService.getWeatherByCity(city);
      const currentConditions = weather.weather?.[0]?.main?.toLowerCase() || '';
      const matched = alertType.some(t => currentConditions.includes(t));

      if (matched) {
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

export default { checkAlertsAndTrigger };
