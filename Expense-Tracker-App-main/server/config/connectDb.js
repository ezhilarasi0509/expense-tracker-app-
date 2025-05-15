const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully Connected To MongoDB");
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDb;
