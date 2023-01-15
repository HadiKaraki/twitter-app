const express = require('express');
const app = express();
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync')

module.exports.showHome = async(req, res) => {
    if (req.isAuthenticated()) {
        const userID = req.user.id
        const currUserFollowing = await User.findById(userID).populate({
            path: 'following',
            populate: {
                path: 'following'
            }
        }).populate('following');

        const postsFollowing = currUserFollowing.following.populate({
            path: 'posts',
            populate: {
                path: 'author'
            }
        }).populate('author');
        res.render('home', { currUserFollowing, postsFollowing });
    } else {
        res.redirect('/user/login')
    }
}