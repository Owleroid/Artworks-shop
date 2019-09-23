const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: ''
  }
}));

// >---- GET ----< //

exports.getLogIn = (req, res, next) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/log-in', {
    path: '/log-in',
    pageTitle: 'Авторизация',
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignUp = (req, res, next) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/sign-up', {
    path: '/sign-up',
    pageTitle: 'Регистрация',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset-password', {
    path: '/reset',
    pageTitle: 'Сброс пароля',
    errorMessage: message
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');

      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }

      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'Новый пароль',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStausCode = 500;
      return next(error);
    });
};

// >---- POST ----< //

exports.postLogIn = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/log-in', {
      path: '/log-in',
      pageTitle: 'Авторизация',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/log-in', {
          path: '/log-in',
          pageTitle: 'Авторизация',
          errorMessage: 'Пользователь с таким почтовым адресом не обнаружен. Пожалуйста, проверьте правильность почтового адреса.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.isAdmin = user.isAdmin;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('auth/log-in', {
            path: '/log-in',
            pageTitle: 'Авторизация',
            errorMessage: 'Доступ отклонён. Пожалуйста, проверьте правильность введённого пароля.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/log-in');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStausCode = 500;
      return next(error);
    });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const phone = req.body.phone;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/sign-up', {
      path: '/sign-up',
      pageTitle: 'Регистрация',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        phone: phone,
        fullName: {
          firstName: firstName,
          lastName: lastName
        },
        password: hashedPassword,
        cart: { items: [] }
      });
      return user.save();
    })
    .then(() => {
      res.redirect('/log-in');
      return transporter.sendMail({
        to: email,
        from: 'home-story.com.ua',
        subject: 'Регистрация завершена!',
        html: '<h1>Вы успешно зарегистрированны!</h1>'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStausCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'Пользователь с таким почтовым адресом отсутствует.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'home-story.com.ua',
          subject: 'Сброс пароля',
          html: `
          <p>Вы запросили сброс пароля</p>
          <p>Перейдите по данной <a href="http://localhost:3000/reset/${token}">ссылке</a> для сброса пароля.</p>`
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStausCode = 500;
        return next(error);
      });
  })
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect('/log-in');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStausCode = 500;
      return next(error);
    });
};