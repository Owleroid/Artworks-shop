const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI = `mongodb+srv://Admin:${encodeURIComponent(
  "FILFE0t0Mt2zsx6h"
)}@cluster0-0cvjg.mongodb.net/shop`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/PNG" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/JPG" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/JPEG"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const mainPageRoutes = require("./routes/main");
const shopRoutes = require("./routes/shop");
const articlesRoutes = require("./routes/articles");

app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "Very, very, very secret string",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.isAdmin = req.session.isAdmin;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(mainPageRoutes);
app.use(shopRoutes);
app.use(articlesRoutes);

app.use("/500", errorController.get500);
app.use(errorController.get404);
app.use((error, req, res, next) => {
  console.log(error);
  res.redirect("/500");
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 3000);
    console.log("Connected");
  })
  .catch(err => {
    console.log(err);
  });
