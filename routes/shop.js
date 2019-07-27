const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();



// Post routes


// router.post('/create-order', isAuth, shopController.postOrder);

module.exports = router;