const fileHelper = require('../util/file');

const { validationResult } = require('express-validator/check');

const Product = require('../models/product');
const Article = require('../models/article');
const Image = require('../models/image');
const Order = require('../models/order');

// All related to products

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

exports.getProductsManagement = (req, res, next) => {
    Product.find()
        .then(products => {
            return res.render('admin/products-management', {
                path: '/admin/products-management',
                pageTitle: 'Products management',
                products: products
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStausCode = 500;
            return next(error);
        });
};

exports.postAddProduct = (req, res, next) => {
    console.log("!!!");
    const category = req.body.category;
    const title = req.body.title;
    const price = req.body.price;
    const measureSystem = req.body.measureSystem;
    const width = req.body.width;
    const height = req.body.height;
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const link = req.body.link;
    const description = req.body.description;
    const image = req.file;

    if (!image) {
        return res.status(422).render('admin/add-edit-product', {
            pageTitle: 'Edit product',
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            product: {
                category: category,
                title: title,
                price: price,
                measureSystem: measureSystem,
                width: width,
                height: height,
                firstName: firstName,
                secondName: secondName,
                link: link,
                description: description
            },
            errorMessage: 'Please make sure that you chose the image for your product!',
            validationErrors: []
        });
    };

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/add-edit-product', {
            pageTitle: 'Edit product',
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            product: {
                category: category,
                title: title,
                price: price,
                measureSystem: measureSystem,
                width: width,
                height: height,
                firstName: firstName,
                secondName: secondName,
                link: link,
                description: description
            },
            errorMessage: 'Somethink went wrong. Please check all required fields!',
            validationErrors: errors.array()
        });
    };

    const imageURL = image.path;

    const product = new Product({
        category: category,
        title: title,
        description: description,
        parameters: {
            measureSystem: measureSystem,
            width: width,
            height: height
        },
        price: price,
        author: {
            fullName: {
                firstName: firstName,
                secondName: secondName
            },
            link: link
        },
        imageURL: imageURL
    });

    product.save()
        .then(() => {
            res.redirect('/admin/products-management');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};