// Mongoose Model for Image
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Image Schema
const imageSchema = new Schema({
    userId: String,
    email: String,
    name: String,
    date: Date,
    key: String,
    _user: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('images', imageSchema);
