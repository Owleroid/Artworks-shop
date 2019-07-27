const Artwork = require('../models/artwork');
const Photo = require('../models/photo');
const Sculpture = require('../models/sculpture');
const Order = require('../models/order');

// <---- Artworks ----> //

exports.getShop = (req, res, next) => {
  res.render('shop/shop', {
    path: '/shop',
    pageTitle: 'Каталог товаров'
  });
};

// <---- Sculptures ----> //



// <---- Photos ----> //


