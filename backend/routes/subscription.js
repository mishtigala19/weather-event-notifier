const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

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

module.exports = router;
