require('dotenv').config();  // Load environment variables
const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const morgan = require('morgan');



// Initialize app and connect to DB
const app = express();
connectDB();

// server.js
const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());
require('./middlewares/authMiddleware');//middlewares/authMiddleware.js

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/student'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
