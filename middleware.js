const passport = require('passport');
const { authenticate } = require('passport');
const { postSchema } = require('./schemas.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('../../user/login');
    }
    next();
}

module.exports.passAuthenticate = (req, res, next) => {
    passport.authenticate('local', { failureFlash: true, failureRedirect: '../user/login' })
    next();
}
