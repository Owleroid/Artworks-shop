const Product = require('../models/product');
const Order = require('../models/order');

// <---- Artworks ----> //

exports.getArtworks = (req, res, next) => {
  Product.find()
    .then((artworks) => {
      return res.render('shop/artworks', {
        path: '/artworks',
        pageTitle: 'Artworks',
        products: artworks
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStausCode = 500;
      return next(error);
    });
};

// <---- Photos ----> //

exports.getPhotos = (req, res, next) => {
  Product.find()
    .then((photos) => {
      return res.render('shop/photos', {
        path: '/photos',
        pageTitle: 'Photos',
        products: photos
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStausCode = 500;
      return next(error);
    });
};

// <---- Sculptures ----> //

exports.getSculptures = (req, res, next) => {
  Product.find()
    .then((sculptures) => {
      res.render('shop/sculptures', {
        path: '/sculptures',
        pageTitle: 'Sculptures',
        products: sculptures
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStausCode = 500;
      return next(error);
    });
};





