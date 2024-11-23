const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model('Contact', ContactSchema);
