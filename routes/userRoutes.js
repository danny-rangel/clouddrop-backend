const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const User = mongoose.model('users');
const SharedImage = mongoose.model('sharedImages');

module.exports = app => {
    // Get shared images for user
    app.get('/api/share', requireLogin, async (req, res) => {
        const sharedImages = await SharedImage.find({ sharedId: req.user._id });
        res.send(sharedImages);
    });

    // Add user to shared images list
    app.post('/api/share', requireLogin, async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new Error('No user found!');
        }

        const NewSharedImage = new SharedImage({
            ownerId: req.user._id,
            ownerEmail: req.user.email,
            ownerName: req.user.name,
            date: Date.now(),
            key: req.body.key,
            sharedId: user._id,
            sharedEmail: user.email,
            sharedName: user.name,
            _user: req.user._id
        });

        await NewSharedImage.save();

        res.send(NewSharedImage);
    });
};
