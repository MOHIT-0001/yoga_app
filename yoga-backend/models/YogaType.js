const mongoose = require('mongoose');

const yogaDetailSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    description: String,
    benefits: [String],
    steps: [String] // Add steps if your document has it.
}, { _id: false });

const yogaTypeSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },  // Explicitly define _id
    yoga1: yogaDetailSchema  // Use yoga1 as the key
}, { timestamps: true });

const YogaType = mongoose.model('YogaType', yogaTypeSchema, 'yoga-types');

module.exports = YogaType;