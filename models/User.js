const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    userPhoto: { type: String, default: '' },
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
   // description: { type: String },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});


module.exports = mongoose.model('User', UserSchema);
