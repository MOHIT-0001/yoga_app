const mongoose = require('mongoose');


const PreviousSessionSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format: 'YYYY-MM-DD'
  duration: { type: String, required: true }
});


const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
    favouriteYoga: { type: [String], default: [] },
  favouriteMusic: { type: [String], default: [] },
  previousYogaSessions: [PreviousSessionSchema]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
