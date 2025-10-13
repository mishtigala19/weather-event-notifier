import express from 'express';
import Subscription from '../models/Subscription.js';
import weatherService from '../services/weatherService.js';
import { sendSMS } from '../services/smsService.js';
import { sendEmailAlert } from '../services/emailService.js';

const router = express.Router();


// POST /api/subscription  → create a new subscription
router.post('/', async (req, res) => {
  const { email, phone, location, alertTypes, notificationMethods, timezone } = req.body;
  
  const hasCity = !!location?.city;
  const hasCoords = location?.coordinates?.lat != null && location?.coordinates?.lon != null;
  if (!email || !(hasCity || hasCoords) || !Array.isArray(alertTypes) || alertTypes.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields.'
    });
  }

  try {
    console.log('SUBSCRIBE ROUTE VERSION v3', { gotCity: location?.city, gotCountry: location?.country });
    // Save to DB
    const newSub = new Subscription({
      email,
      phone,
      location,
      alertTypes,
      notificationMethods: Array.isArray(notificationMethods) && notificationMethods.length ? notificationMethods : ['email'],
      timezone: typeof timezone === 'string' && timezone ? timezone : 'America/New_York'
    });
    await newSub.save();

    // Fire-and-forget: send welcome notification with current weather
    (async () => {
      try {
        const baseUrl = process.env.BASE_URL || 'http://localhost:5001';
        const unsubLink = `${baseUrl}/api/subscription/${newSub._id}/unsubscribe`;

        // Decide notification channels
        const shouldEmail = Array.isArray(notificationMethods)
          ? notificationMethods.includes('email')
          : true; // default to email if none provided
        const shouldSms = Array.isArray(notificationMethods) && notificationMethods.includes('sms') && !!phone;

        // Fetch current weather for provided location
        let weatherData = null;
        const city = (location?.city || '').trim();
        const country = (location?.country || '').trim();

        if (city) {
          const q = country ? `${city},${country}` : city;
          weatherData = await weatherService.getWeatherByCity(q);
        } else if (
          location?.coordinates?.lat != null &&
          location?.coordinates?.lon != null
        ) {
          const { lat, lon } = location.coordinates;
          weatherData = await weatherService.getWeatherByCoordinates(lat, lon);
        }

        const readableCity = city || (weatherData?.name ?? 'your area');
        const description = weatherData?.current?.description ?? 'N/A';
        const temperature = Math.round(weatherData?.current?.temperature ?? 0);

        if (shouldEmail && email) {
          await sendEmailAlert(
            email,
            'Welcome to Weather Event Notifier',
            'Subscription Confirmed',
            weatherData || {},
            readableCity,
            unsubLink
          );
        }

        if (shouldSms && phone) {
          const smsMessage = `Welcome! Current weather in ${readableCity}: ${description}, ${temperature}°C. Unsubscribe: ${unsubLink}`;
          try {
            await sendSMS(phone, smsMessage);
          } catch (smsErr) {
            console.error('Welcome SMS failed:', smsErr.message);
          }
        }
      } catch (notifyErr) {
        console.error('Welcome notification failed:', notifyErr.message);
      }
    })();

    // Optional: quick weather fetch to validate API & location
    let weatherSnippet = null;
    try {
      const city = (location?.city || '').trim();
      const country = (location?.country || '').trim();

    if (city) {
      // Use "City" or "City,Country"
      const q = country ? `${city},${country}` : city;
      console.log('🌤️ Quick weather check for:', q);
      const wx = await weatherService.getWeatherByCity(q);
      weatherSnippet = wx?.current?.description || null;
    } else if (
      location?.coordinates?.lat != null &&
      location?.coordinates?.lon != null
    ) {
      // Or fall back to coordinates if provided
      const { lat, lon } = location.coordinates;
      console.log('🌤️ Quick weather check (coords):', lat, lon);
      const wx = await weatherService.getWeatherByCoordinates(lat, lon);
      weatherSnippet = wx?.current?.description || null;
    } else {
      // Nothing to geocode → skip instead of erroring
      console.log('🌤️ Skipping quick weather check: no city or coordinates provided');
    }
  } catch (e) {
    console.warn('Weather check failed:', e.message);
  }

    return res.json({
      success: true,
      message: 'Subscription created successfully.',
      weather: weatherSnippet
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during subscription creation.',
      error: error.message
    });
  }
});

// POST /api/subscription/send-test  → send a test alert
router.post('/send-test', async (req, res) => {
  const { contact, alertType, email, phone, location, alertTypes } = req.body;

  const to = contact || email || phone;
  const type = alertType || (Array.isArray(alertTypes) && alertTypes[0]) || 'General';
  const place = typeof location === 'string' ? location : location?.city || 'your area';

  if (!to) {
    return res.status(400).json({ success: false, message: 'Contact (email or phone) is required.' });
  }

  try {
    console.log(`TEST ALERT -> ${to}: ${type} at ${place}`);
    return res.json({ success: true, message: `Test alert sent to ${to}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error sending test alert.', error: error.message });
  }
});


// DELETE /api/subscription/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Subscription.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found.'
      });
    }

    res.json({
      success: true,
      message: 'Subscription deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during deletion.',
      error: error.message
    });
  }
});

// PUT /api/subscription/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Simple validation example
  if (updates.email && !/^\S+@\S+\.\S+$/.test(updates.email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format.'
    });
  }

  try {
    const result = await Subscription.findByIdAndUpdate(id, updates, {
      new: true
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found.'
      });
    }

    res.json({
      success: true,
      message: 'Subscription updated successfully.',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during update.',
      error: error.message
    });
  }
});

/**
 * GET /api/subscription/:id/unsubscribe
 * Alias for the DELETE route so users can click a link.
 */

router.get('/:id/unsubscribe', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Subscription.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send('Subscription not found.');
    }
    res.send('You have been unsubscribed from all weather alerts. Stay safe!');
  }
  catch (error) {
    res.status(500).send('Error processing unsubscribe request.');
  }
});

export default router;
