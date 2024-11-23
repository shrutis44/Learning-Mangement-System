const Contact = require('../models/Contact');


exports.addContact = async (req, res) => {
  const { fullName, username, contactNumber, email } = req.body;

  try {
    if (!fullName || !username || !contactNumber || !email ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = new Contact({ fullName, username, contactNumber, email });
    await contact.save();

    res.status(201).json({ message: 'Contact submitted successfully', contact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
