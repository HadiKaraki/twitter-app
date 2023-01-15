const posts = require('../controllers/post');
const express = require('express');
const { isLoggedIn } = require('../middleware');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const catchAsync = require('../utils/catchAsync');

router.post('/new', upload.array('image'), isLoggedIn, catchAsync(posts.newPost))

router.post('/like', isLoggedIn, catchAsync(posts.likePost))

router.post('/dislike', isLoggedIn, catchAsync(posts.dislikePost))

router.post('/pinpost/:postID', isLoggedIn, catchAsync(posts.pinPost))

router.post('/unpinpost/:postID', isLoggedIn, catchAsync(posts.unpinPost))

router.route('/:username/:id')
    .get(isLoggedIn, posts.showPost)
    .delete(isLoggedIn, catchAsync(posts.deletePost));

module.exports = router;
