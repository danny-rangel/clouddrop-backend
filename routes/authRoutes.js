const passport = require('passport');

// Google OAuth Stuff
module.exports = app => {
    app.get(
        '/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );

    app.get(
        '/auth/google/callback',
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('http://localhost:3000/dashboard');
        }
    );

    // Log out user
    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    // Get current logged in user
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });
};
