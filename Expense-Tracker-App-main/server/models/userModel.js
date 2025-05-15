const mongoose = require('mongoose')

//schema 
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true,'Name is required']
    },
    email:
    {
        type:String,
        required:[true,"Email is required and should be unique"],
        unique:true,
    },
    password:
    {
        type:String,
        required: [true, "Password is required"]
    },
    initialBalance: {
        type: Number,
        required: [true, "Initial Balance is required"]
    }
    },
    {timestamps:true}
);

//export
const userModel = mongoose.model('user',userSchema)
module.exports = userModel