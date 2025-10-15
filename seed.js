require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/course');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true });

const courses = [
  { code:'CS101', name:'Intro to CS', instructor:'Dr. Smith', schedule:'Mon/Wed 10:00-11:30', credits:3, availableSeats:50 },
  { code:'MATH201', name:'Calculus I', instructor:'Prof. Johnson', schedule:'Tue/Thu 13:00-14:30', credits:4, availableSeats:40 }
];

async function seed() {
  await Course.deleteMany({});
  await Course.insertMany(courses);
  console.log('Seeded courses');
  mongoose.disconnect();
}

seed();
