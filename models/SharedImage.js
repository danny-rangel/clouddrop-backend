// Mongoose Model for Shared Image
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Shared Image Schema
const sharedImageSchema = new Schema({
    ownerId: String,
    ownerEmail: String,
    ownerName: String,
    date: Date,
    key: String,
    sharedId: String,
    sharedEmail: String,
    sharedName: String,
    _user: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('sharedImages', sharedImageSchema);
