const fileHelper = require('../util/file');

const { validationResult } = require('express-validator/check');

const Product = require('../models/product');
const Article = require('../models/article');
const Image = require('../models/image');
const Order = require('../models/order');

// Add product

exports.getAddproduct = (req, res, next) => {
    res.render('admin/add-edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add new product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

// exports.postAddProduct = (req, res, next) => {
//     console.log(req);
// };



