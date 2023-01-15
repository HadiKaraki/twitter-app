const User = require('../models/user');
const flash = require('connect-flash');
const { cloudinary } = require("../cloudinary");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var user;
var following = false;

module.exports.account = async(req, res) => {
    const currUserID = req.user._id
    user = await User.findById(currUserID).populate({
        path: 'posts',
        populate: {
            path: 'posts'
        }
    }).populate('posts');
    user = await user.populate('pinned_post');
    res.render('account', { user })
}

module.exports.userAccount = async(req, res) => {
    const { username } = req.params
    const currUserID = req.user._id;
    const currUser = await User.findById(currUserID);
    var follower;
    following = false;
    user = await User.findOne({ username: username }).populate({
        path: 'posts',
        populate: {
            path: 'posts'
        }
    }).populate('posts');
    if (user) {
        const index1 = currUser.following.indexOf(user._id);
        const index2 = currUser.followers.indexOf(user._id);
        if (index1 > -1) {
            following = true
        }
        if (index2 > -1) {
            follower = true
        }
        res.render('account', { user, following, follower });
    } else {
        req.flash('error', 'User not found');
        res.redirect('back');
    }
}

module.exports.verify = async(req, res) => {
    const username = req.query.username;
    const email = req.query.email;
    const checkUsername = await User.findOne({ username });
    const checkEmail = await User.findOne({ email });
    if (req.isAuthenticated()) {
        if (checkUsername && username != req.user.username) {
            res.send("username");
        } else if (checkEmail && email != req.user.email) {
            res.send("email");
        } else {
            res.send("false");
        }
    } else {
        if (checkUsername) {
            res.send("username");
        } else if (checkEmail) {
            res.send("email");
        } else {
            res.send("false");
        }
    }
}

module.exports.follow = async(req, res) => {
    const userID = req.user._id;
    const currUser = await User.findById(userID);
    if (!following) {
        currUser.following.push(user);
        await currUser.save()
        user.followers.push(currUser)
        await user.save();
        following = true;
        //await User.findByIdAndUpdate(userID, { $pull: { posts: id } });
    } else {
        await User.findByIdAndUpdate(userID, { $pull: { following: user._id } });
        await User.findByIdAndUpdate(user._id, { $pull: { followers: userID } });
        // const index1 = currUser.following.indexOf(user._id);
        // const index2 = user.followers.indexOf(currUser._id);
        // if (index1 > -1 && index2 > -1) {
        //     currUser.following.splice(index1, 1);
        //     user.followers.splice(index2, 1);
        //     currUser.following = currUser.following.filter(element => {
        //         return element !== null;
        //     });
        //     await currUser.save()
        //     user.followers = user.followers.filter(element => {
        //         return element !== null;
        //     });
        //     await user.save()
        // }
        following = false
    }
    res.redirect(`/user/${user.username}`);
}

module.exports.following = async(req, res) => {
    const { username } = req.params
    const userFollowing = await User.findOne({ username: username }).populate({
        path: 'following',
        populate: {
            path: 'following'
        }
    }).populate('following');
    res.render('following', { userFollowing });
}

module.exports.followers = async(req, res) => {
    const { username } = req.params
    const userFollowers = await User.findOne({ username: username }).populate({
        path: 'followers',
        populate: {
            path: 'followers'
        }
    }).populate('followers');
    res.render('followers', { userFollowers });
}

module.exports.profile = async(req, res) => {
    res.render('profile', { user });
}

module.exports.editProfile = async(req, res) => {
    const userID = req.user._id;
    const user = await User.findByIdAndUpdate(userID, {...req.body.user });
    if (req.file) {
        user.cover_image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    if (req.body.removeCover) {
        await cloudinary.uploader.destroy(removeCover);
        //await User.findByIdAndUpdate(userID, { $pull: { following: user._id } });
        user.cover_image.url = '';
        user.cover_image.filename = '';
    }
    await user.save();
    req.flash('success', 'Successfully updated profile');
    res.redirect('/user/account');
}

module.exports.searchUsers = async(req, res) => {
    const { name } = req.body
    const users = await User.find({ username: name })
    console.log(name)
    res.render('users', users);
}

module.exports.testSearch = async(req, res) => {
    let payload = req.body.payload.trim();
    console.log(payload)
}

module.exports.renderRegister = (req, res) => {
    res.render('register');
}

module.exports.register = async(req, res) => {
    try {
        const { password } = req.body;
        const user = new User(req.body.user);
        user.password = password;
        if (req.file) {
            user.profile = {
                url: req.file.path,
                filename: req.file.filename
            }
        } else {
            user.profile = {
                url: '',
                filename: ''
            }
        }
        user.cover_image = {
            url: '',
            filename: ''
        }
        user.admin = false;
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome!');
            res.redirect(`/user/account`);
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/user/register');
    }
}

module.exports.forgotPassword = async(req, res) => {
    res.render('forgot_password');
}

module.exports.forgotPassEmail = async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        res.send("signup");
        return;
    }
    payload = {
        id: user._id,
        email: email
    };
    secret = uuidv4();
    var token = jwt.sign(payload, secret, { expiresIn: '1h' })
    const output = `<p>A password reset was requested on this account. Click on 
                        <a href="http://localhost:3000/user/resetpassword/${user._id}/${token}">
                            this
                        </a>
                        link in order to reset your password. This link expires in 1 hour.
                    </p>`
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hadikaraki373@gmail.com',
            pass: 'vztvzljysxeckygd'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"PAYF" hadikaraki373@gmail.com',
        to: email, // list of receivers
        subject: 'Password reset request',
        text: '', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
    res.send('found');
}

module.exports.changePasswordPage = async(req, res) => {
    const token = req.params.token;
    jwt.verify(req.params.token, secret, (err, authData) => {
        if (err) {
            res.send("Wrong or expired link");
        } else {
            const userID = req.params.userID;
            res.render('user/reset_password', { userID, token });
        }
    });
}

module.exports.changePassword = async(req, res) => {
    jwt.verify(req.params.token, secret, async(err, authData) => {
        if (err) {
            res.send("Wrong or expired link");
        } else {
            const { userID } = req.params
            const user = await User.findById(userID);
            const { newPassword } = req.body;
            user.setPassword(newPassword, function() {
                user.save();
                req.flash('success', 'Succesfuly changed password!')
                res.redirect('/user/login');
            });
            secret = uuidv4();
        }
    });
}

module.exports.renderLogin = async(req, res) => {
    if (!req.isAuthenticated()) {
        res.render('login');
    } else {
        res.redirect(`/user/account`);
    }
}

module.exports.renderAdminLogin = async(req, res) => {
    res.render('admin_login');
}

module.exports.login = async(req, res) => {
    const name = req.user.username
    const redirectUrl = req.session.returnTo || '/user/account';
    delete req.session.returnTo;
    req.flash('success', 'welcome back!');
    res.redirect(redirectUrl);
}

module.exports.AdminLogin = async(req, res) => {
    const name = req.user.username
    req.flash('success', 'welcome back!');
    res.redirect('/user/account');
}

module.exports.logout = async(req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
    req.flash('success', "Goodbye!");
    res.redirect('/user/login');
}