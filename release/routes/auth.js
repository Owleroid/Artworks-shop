const express = require('express');
const { check } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

// Get routes

router.get('/log-in', authController.getLogIn);

router.get('/sign-up', authController.getSignUp);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPassword);


// Post routes

router.post('/log-in',
    [
        check('email', 'Пожалуйста, введите валидный почтовый адрес')
            .isEmail()
            .normalizeEmail()
    ],
    authController.postLogIn);

router.post('/sign-up',
    [
        check('email', 'Пожалуйста, введите валидный почтовый адрес.')
            .isEmail()
            .normalizeEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('Данный почтовый адрес занят, пожалуйста, выберите другой.');
                        }
                    })
            }),
        check('password', 'Пароль должен быть не менее 5 символов в длинну.')
            .isLength({ min: 5 })
            .trim(),
        check('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Пароли не совпадают.')
                }
                return true;
            })
    ],
    authController.postSignUp);

router.post('/logout', authController.postLogout);

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);

module.exports = router;