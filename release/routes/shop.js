const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// Common routes

router.get('/products/:productId', shopController.getProduct);

// Artworks routes

router.get('/artworks', shopController.getArtworks);

// Photos routes

router.get('/photos', shopController.getPhotos);

// Sculptures routes

router.get('/sculptures', shopController.getSculptures);

// Cart routes

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart-add-product', isAuth, shopController.postAddToCart);

router.post('/cart-delete-product', isAuth, shopController.postCartDeleteProduct);

router.post('/cart-create-order', isAuth, shopController.postCreateOrder);

module.exports = router;