const home = require('../controllers/home');
const express = require('express');
const { isLoggedIn } = require('../middleware');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const catchAsync = require('../utils/catchAsync');

router.get('/', home.showHome)

module.exports = router;