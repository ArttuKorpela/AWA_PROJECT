const mongoose = require('mongoose');


const likeSchema = new mongoose.Schema({
    liker: {
        type: String,
        required: true
    }, liked: {
        type: String,
        required: true
    }
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;