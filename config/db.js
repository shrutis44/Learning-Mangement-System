const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        //await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Data');
        //await mongoose.connect(process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/Data');
        await mongoose.connect('mongodb+srv://shrutimaurya782:%40Shrutis44@cluster0.xb00l.mongodb.net/data')
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
