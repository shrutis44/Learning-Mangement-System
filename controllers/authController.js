const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const registerUser = async (req, res) => {
    const { userPhoto,fullName, username, dateOfBirth, email, password, confirmPassword ,description} = req.body;

    if (!fullName || !username || !dateOfBirth || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userPhoto: userPhoto || '',
            fullName,
            username,
            dateOfBirth,
            email,
            password: hashedPassword,
            description,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        console.log('User fetched:', user); 
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch); 
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};




const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateUserProfile = async (req, res) => {
    const { fullName, username, dateOfBirth, email } = req.body;

    try {
    
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (fullName) user.fullName = fullName;
        if (username) user.username = username;
        if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth); 
        if (email) user.email = email;

        const updatedUser = await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                username: updatedUser.username,
                dateOfBirth: updatedUser.dateOfBirth,
                email: updatedUser.email,
                enrolledCourses: updatedUser.enrolledCourses,
            },
        });
    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ error: 'Server error' });
    }  
    
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
};
