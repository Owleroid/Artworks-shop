const Product = require('../models/product');
const Order = require('../models/order');

// <---- Artworks ----> //

exports.getArtworks = (req, res, next) => {
  Product.find({ 'category': 'artworks' })
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
  Product.find({ 'category': 'photos' })
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
  Product.find({ 'category': 'sculptures' })
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

// <---- Product details ----> //>

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-details', {
        path: '/products',
        pageTitle: product.title,
        product: product
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// <---- Cart ----> //

exports.getCart = async (req, res, next) => {
  const user = await req.user.populate('cart.items.productId').execPopulate();
  const userOrders = await Order.find({ 'user.userId': req.user._id }).populate('products.productId').exec();

  try {
    const products = user.cart.items;
    let totalCartPrice = 0;

    if (products.length > 0) {
      products.forEach(product => {
        totalCartPrice += product.total;
      });
    }

    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Cart',
      products: products,
      cartTotal: totalCartPrice,
      orders: userOrders
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStausCode = 500;
    return next(error);
  };
};

exports.postAddToCart = (req, res, next) => {
  console.log("AddToCart - triggered")
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(product => {
      if(product) {
        console.log("Found")
      }
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStausCode = 500;
      return next(error);
    });
};