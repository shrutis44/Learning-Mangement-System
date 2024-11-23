const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://shrutimaurya782:%40Shrutis44@cluster0.xb00l.mongodb.net/Learn')
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
