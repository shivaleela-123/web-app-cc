const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  phone:    String,
  password: { type: String, required: true },
  courses:  [{ type: String }]
});

module.exports = mongoose.model('Student', studentSchema);
