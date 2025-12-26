const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'This username is taken']
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
