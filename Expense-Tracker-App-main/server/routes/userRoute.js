// routes/userRoute.js
const express = require('express');
const router = express.Router();
const { loginController, registerController, getUserBalance, getAllUsers } = require('../controllers/userController');

//Login
router.post('/login', loginController);

//Register
router.post('/register', registerController);

//Get Balance
router.post('/getbalance', getUserBalance);

//Get All Users
router.get('/', getAllUsers);

module.exports = router;
