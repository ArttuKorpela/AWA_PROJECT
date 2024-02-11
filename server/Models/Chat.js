const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const messageSchema = new Schema({
    time: { type: Date, default: Date.now }, // Automatically set the time to the current time
    sender: { type: String, required: true },
    content: { type: String, required: true },
});


const chatSchema = new Schema({
    messages: [messageSchema],
});

// Create the model from the schema
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;