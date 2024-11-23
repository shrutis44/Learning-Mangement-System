const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course_images: { type: String }, 
  url: { type: String, required: true },
  price: { type: Number, required: true },
  num_subscribers: { type: Number, default: 0 },
  num_reviews: { type: Number, default: 0 },
  num_lectures: { type: Number, required: true },
  level: { type: String, required: true }, 
  rating: { type: Number, min: 0, max: 1, required: true },
  content_duration: { type: Number, required: true }, 
  published_date: { type: String, required: true },
  subject: { type: String, required: true },
  course_content: { type: String }, 
});

module.exports = mongoose.model('Course', CourseSchema);
