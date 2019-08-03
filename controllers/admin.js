const fileHelper = require('../util/file');

const Product = require('../models/product');
const Article = require('../models/article');
const Image = require('../models/image');
const Order = require('../models/order');

// All related to products

exports.getAddproduct = (req, res, next) => {
    res.render('admin/add-edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add new product',
        editing: false
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

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    const productId = req.params.productId;

    if (!editMode) {
        return res.redirect('/admin/products-management');
    }

    Product.findById(productId)
        .then(product => {

            if (!product) {
                return res.redirect('/admin/products-management');
            }

            res.render('admin/add-edit-product', {
                pageTitle: 'Edit product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStausCode = 500;
            return next(error);
        });
};

exports.postAddProduct = (req, res, next) => {
    const category = req.body.category;
    const title = req.body.title;
    const price = req.body.price;
    const measureSystem = req.body.measureSystem;
    const width = req.body.width;
    const height = req.body.height;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
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
                lastName: lastName,
                link: link,
                description: description
            },
            errorMessage: 'Please make sure that you chose the image for your product!',
            validationErrors: []
        });
    }

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
                lastName: lastName
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

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const category = req.body.category;
    const title = req.body.title;
    const price = req.body.price;
    const measureSystem = req.body.measureSystem;
    const width = req.body.width;
    const height = req.body.height;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const link = req.body.link;
    const description = req.body.description;
    const image = req.file;

    Product.findById(productId)
        .then(product => {

            if (image) {
                fileHelper.deleteFile(product.imageURL);
                product.imageURL = image.path;
            }

            product.category = category;
            product.title = title;
            product.description = description;
            product.parameters = { measureSystem: measureSystem, width: width, height: height };
            product.price = price;
            product.author = { fullName: { firstName: firstName, lastName: lastName }, link: link };

            return product.save();
        })
        .then(() => {
            res.redirect('/admin/products-management');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return next(new Error('Can\'t find product with such Id.'));
            }
            fileHelper.deleteFile(product.imageURL);
            return Product.deleteOne({ _id: prodId });
        })
        .then(() => {
            res.redirect('/admin/products-management');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStausCode = 500;
            return next(error);
        });
};