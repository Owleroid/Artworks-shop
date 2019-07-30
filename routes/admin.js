const express = require('express');
const { check } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

// Add product routes

router.get('/add-product', isAuth, isAdmin, adminController.getAddproduct);

// router.post('add-product', isAuth, isAdmin, adminController.postAddProduct);

module.exports = router;