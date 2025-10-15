require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const Student = require('./models/student');
const Course  = require('./models/course');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('Mongo connect error', err));

// Registration
app.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;
    if (!fullName || !email || !password) return res.status(400).send('Missing fields');
    if (password !== confirmPassword) return res.status(400).send('Passwords must match');

    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).send('Email already registered');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await Student.create({ fullName, email, phone, password: hash, courses: [] });
    res.redirect('/login.html');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).send('Invalid credentials');

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    res.redirect('/dashboard.html');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get courses
app.get('/api/courses', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Register course
app.post('/api/register-course', async (req, res) => {
  const { email, courseCode } = req.body;
  const student = await Student.findOne({ email });
  if (!student) return res.status(400).send('Student not found');
  if (!student.courses.includes(courseCode)) {
    student.courses.push(courseCode);
    await student.save();
  }
  res.send('Registered for course');
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
