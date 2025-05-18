const express = require('express');
const router = express.Router();
const YogaType = require('../models/YogaType');

// GET /api/yoga
router.get('/', async (req, res) => {
  try {
    const data = await YogaType.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
