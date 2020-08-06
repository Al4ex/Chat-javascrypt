const mongoose = require('mongoose'); // Erase if already required import mongoose from 'mongoose';


// Declare the Schema of the Mongo model
const ChatSchema = new mongoose.Schema({
    nick:{
        type:String,
    },
    msg:{
        type:String,
    },
    created_at:{
        type:Date,
        default:Date.now
    },
});

//Export the model
module.exports = mongoose.model('chat', ChatSchema);