const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const { body, validationResult } = require('express-validator');
const fetch = require('node-fetch');
require('dotenv').config();

// Custom action routes should come before parameter routes
router.delete('/actions/cleanup', async (req, res) => {
  try {
    const result = await Place.deleteMany({
      category: { $ne: 'other' }
    });
    res.json({
      message: `Successfully deleted ${result.deletedCount} places that were not in 'other' category`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting places:', error);
    res.status(500).json({ error: error.message });
  }
});


// Get all places
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category, isActive: true } : { isActive: true };
    const places = await Place.find(query).sort({ name: 1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get places by category
router.get('/category/:category', async (req, res) => {
  try {
    const places = await Place.find({ 
      category: req.params.category,
      isActive: true 
    }).sort({ name: 1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single place by ID
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new place
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Place name is required'),
    body('latitude').isFloat().withMessage('Valid latitude is required'),
    body('longitude').isFloat().withMessage('Valid longitude is required'),
    body('category').isIn([
      'eateries', 'recreation', 'educational', 'administration', 
      'staff_quarters', 'hostel', 'library', 'other'
    ]).withMessage('Valid category is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const place = new Place(req.body);
      await place.save();
      res.status(201).json(place);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Update a place
router.put('/:id', async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    res.json(place);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a place
router.delete('/:id', async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    res.json({ message: 'Place deleted successfully', place });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk import places with exact coordinates (no geocoding needed)
router.post('/bulk-import', async (req, res) => {
  try {
    const { places } = req.body;
    
    if (!places || !Array.isArray(places)) {
      return res.status(400).json({ error: 'Places array is required' });
    }

    const results = {
      success: [],
      failed: [],
      skipped: []
    };

    for (const placeData of places) {
      const { name, category, description, latitude, longitude, openingHours, contactInfo } = placeData;
      
      if (!name) {
        results.failed.push({ name: name || 'Unknown', error: 'Name is required' });
        continue;
      }

      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        results.failed.push({ name, error: 'Valid latitude and longitude are required' });
        continue;
      }

      // Check if place already exists
      const existing = await Place.findOne({ name: name.trim() });
      if (existing) {
        results.skipped.push({ name, reason: 'Already exists' });
        continue;
      }

      // Create place with provided coordinates
      const place = new Place({
        name: name.trim(),
        description: description || '',
        category: category || 'other',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        openingHours: openingHours || {},
        contactInfo: contactInfo || {},
        isActive: true
      });

      await place.save();
      results.success.push({
        name: place.name,
        coordinates: { lat: place.latitude, lng: place.longitude }
      });
    }

    res.json({
      message: `Bulk import completed: ${results.success.length} created, ${results.failed.length} failed, ${results.skipped.length} skipped`,
      results
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

