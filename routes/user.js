const express = require('express');
const router = express.Router();
const passport = require('passport');
const { authenticate } = require('passport');
const users = require('../controllers/user');
const { isLoggedIn, passAuthenticate } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/register')
    .get(users.renderRegister)
    .post(upload.single('image'), catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '../user/login' }), users.login)

router.get('/verify', users.verify);

router.route('/forgotpassword')
    .get(users.forgotPassword)
    .post(users.forgotPassEmail)

router.route('/admin_login')
    .get(users.renderLogin)
    .post(users.AdminLogin)

router.get('/logout', isLoggedIn, users.logout)

router.get('/account', isLoggedIn, catchAsync(users.account))

router.get('/find', isLoggedIn, catchAsync(users.searchUsers))

router.route('/profile')
    .get(isLoggedIn, users.profile)
    .post(isLoggedIn, upload.single('image'), catchAsync(users.editProfile));

router.get('/:username/following', isLoggedIn, catchAsync(users.following))

router.get('/:username/followers', isLoggedIn, catchAsync(users.followers))

router.post('/follow', isLoggedIn, catchAsync(users.follow))

router.route('/:username')
    .get(isLoggedIn, users.userAccount)
    .post(isLoggedIn, upload.array('image'), catchAsync(users.editAccount));

module.exports = router;