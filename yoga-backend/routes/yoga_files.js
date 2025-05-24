// routes/routes.js
const express = require('express');
const router = express.Router();
const YogaType = require('../models/YogaType');
const Music = require('../models/Music'); // Import the Music model



// GET /api/yoga/yogatypes
router.get('/yogatypes', async (req, res) => {
  try {
    const data = await YogaType.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/yoga/music
router.get('/music', async (req, res) => {
  try {
    const musicData = await Music.find();
    res.status(200).json(musicData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;