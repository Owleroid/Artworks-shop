const express = require('express');

const mainPageController = require('../controllers/main');

const router = express.Router();

router.get('/', mainPageController.getIndex);

module.exports = router;