// models/Music.js
const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Music = mongoose.model('Music', musicSchema, 'music'); // 'music' is the MongoDB collection name

module.exports = Music;
