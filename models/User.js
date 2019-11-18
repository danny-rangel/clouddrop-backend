// Mongoose Model for User
const mongoose = require('mongoose');
const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
    googleId: String,
    email: String,
    name: String,
    imageCount: { type: Number, default: 0 }
});

mongoose.model('users', userSchema);
