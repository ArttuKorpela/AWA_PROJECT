const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    punchline: {
        type: String,
    },
    bio: {
        type: String,
    },
    picture_url: {
        type: String,
    }
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;