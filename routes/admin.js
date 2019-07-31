const express = require('express');
const { check } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

// All routes related to products

router.get('/add-product', isAuth, isAdmin, adminController.getAddproduct);

router.get('/products-management', isAuth, isAdmin, adminController.getProductsManagement);

router.post('/add-product', isAuth, isAdmin, adminController.postAddProduct);

module.exports = router;