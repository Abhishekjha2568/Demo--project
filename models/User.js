const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    college: String,
    city: String,
    otp: String,
    isVerified: { type: Boolean, default: false },
    uniqueId: String
});

module.exports = mongoose.model('User', UserSchema);