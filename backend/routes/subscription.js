import express from 'express';
import Subscription from '../models/Subscription.js';
import weatherService from '../services/weatherService.js';

const router = express.Router();


// POST /api/subscription  → create a new subscription
router.post('/', async (req, res) => {
  const { email, phone, location, alertTypes } = req.body;
  
  const hasCity = !!location?.city;
  const hasCoords = location?.coordinates?.lat != null && location?.coordinates?.lon != null;
  if (!email || !phone || !(hasCity || hasCoords) || !Array.isArray(alertTypes) || alertTypes.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields.'
    });
  }

  try {
    console.log('SUBSCRIBE ROUTE VERSION v3', { gotCity: location?.city, gotCountry: location?.country });
    // Save to DB
    const newSub = new Subscription({ email, phone, location, alertTypes });
    await newSub.save();

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
