const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// Artworks routes

router.get('/artworks', shopController.getArtworks);

// Photos routes

router.get('/photos', shopController.getPhotos);

// Sculptures routes

router.get('/sculptures', shopController.getSculptures);

module.exports = router;