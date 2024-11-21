const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rating: { type: Number, default: 0 },
  learners: { type: Number, default: 0 },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: { type: Number, min: 1, max: 5 },
    },
  ],
});

module.exports = mongoose.model('Course', CourseSchema);
