// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDb = require('./config/connectDb');
const userRoutes = require('./routes/userRoute'); // Correct path to userRoute
const transactionRoutes = require('./routes/transactionRoutes'); // Correct path to transactionRoutes

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDb();

// Initialize Express app
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Port configuration
const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});