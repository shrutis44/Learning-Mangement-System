const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authenticate, getUserProfile); 
router.put('/profile', authenticate, updateUserProfile); 

module.exports = router;
