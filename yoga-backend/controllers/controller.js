const Yoga = require('../models/YogaType');

exports.getAllYoga = async (req, res) => {
  try {
    const poses = await Yoga.find();
    res.json(poses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
