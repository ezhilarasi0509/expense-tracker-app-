// controllers/userController.js
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send('User Not Found');
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');

        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const registerController = async (req, res) => {
    try {
        const { name, email, password, initialBalance } = req.body;
    
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
        
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword, // Save hashed password
            initialBalance
        });
        
        await newUser.save();
        
        res.status(201).json({ success: true, newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

const getUserBalance = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId);
        if (user) {
            res.status(200).json({ balance: user.initialBalance });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { loginController, registerController, getUserBalance, getAllUsers };

