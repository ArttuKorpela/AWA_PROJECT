const mongoose = require('mongoose');


const matchSchema = new mongoose.Schema({
    userID_1: {
        type: String,
        required: true
    }, userID_2: {
        type: String,
        required: true
    }, chatID: {
        type:String,
        required: true
    }
});

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;