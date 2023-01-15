const comments = require('../controllers/comment');
const express = require('express');
const { isLoggedIn } = require('../middleware');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const catchAsync = require('../utils/catchAsync');

router.post('/new/:postID', upload.array('image'), isLoggedIn, catchAsync(comments.newComment))

router.post('/like', isLoggedIn, catchAsync(comments.likeComment))

router.post('/dislike', isLoggedIn, catchAsync(comments.dislikeComment))

router.delete('/delete/:commentID', isLoggedIn, catchAsync(comments.deleteComment))

module.exports = router;