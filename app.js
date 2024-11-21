require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')
const authRoutes = require('./routes/authRoutes.js');

const courseRoutes = require('./routes/courseRoutes');


const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

app.listen(5000, () => {
    console.log('Server running on port 5000');
});

