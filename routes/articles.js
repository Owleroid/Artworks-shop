const express = require('express');

const articlesController = require('../controllers/articles');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


module.exports = router;