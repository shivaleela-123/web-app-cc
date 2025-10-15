const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: String,
  name: String,
  instructor: String,
  schedule: String,
  credits: Number,
  availableSeats: Number
});

module.exports = mongoose.model('Course', courseSchema);
