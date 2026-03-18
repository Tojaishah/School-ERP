
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: String,
  email: String,
  cities: [String],
  budgetRange: String,
  plan: { type: String, enum: ['free','paid'], default: 'free' }
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);
