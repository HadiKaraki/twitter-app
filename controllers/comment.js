const express = require('express');
const app = express();
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

module.exports.newComment = async(req, res) => {
    const { postID } = req.params
    const { text } = req.body;
    const comment = new Comment();
    const post = await Post.findById(postID);
    //comment.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    comment.body = text
    comment.author = req.user._id
    await comment.save()
    post.comments.push(comment)
    await post.save();
    req.flash('success', 'Successfully made a new comment!');
    res.redirect('back')
}

module.exports.deleteComment = async(req, res) => {
    const userID = req.user._id;
    const { commentID } = req.params;
    // find the user that owns the post and remove that post from it (posts array)
    //const post = Post.findOne({ comments: commentID })
    await Post.findOneAndUpdate(commentID, { $pull: { comments: commentID } });
    await Comment.findByIdAndDelete(commentID);
    req.flash('success', 'Successfully deleted comment')
    res.redirect('/user/account');
}

module.exports.likeComment = async(req, res) => {
    const { id } = req.body;
    const userID = req.user._id;
    var commentId = mongoose.Types.ObjectId(id);
    const comment = await Comment.findById(commentId);
    comment.likes = comment.likes + 1;
    comment.users_liked.push(userID);
    await comment.save();
}

module.exports.dislikeComment = async(req, res) => {
    const { id } = req.body;
    const userID = req.user._id;
    var commentId = mongoose.Types.ObjectId(id);
    const comment = await Comment.findById(commentId);
    comment.likes = comment.likes - 1;
    const index = comment.users_liked.indexOf(userID);
    comment.users_liked.splice(index, 1);
    comment.users_liked = comment.users_liked.filter(element => {
        return element !== null;
    });
    likedOrNot = false;
    await post.save();
}