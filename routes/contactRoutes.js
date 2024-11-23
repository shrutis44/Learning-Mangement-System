const express = require('express');
const { addContact, getContacts } = require('../controllers/contactController');
const authenticate = require('../middleware/authMiddleware'); 

const router = express.Router();


router.post('/', addContact);


router.get('/', authenticate, getContacts);

module.exports = router;
