import mongoose from "mongoose"
//const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    friends: [],
    chats:[{
        chatId: String,
        members:[]
    }]
});

export default mongoose.model('User', userSchema);