const fileHelper = require('../util/file');

const { validationResult } = require('express-validator/check');

const Artwork = require('../models/artwork');
const Photo = require('../models/photo');
const Sculpture = require('../models/sculpture');
const Article = require('../models/article');
const Image = require('../models/image');
const Order = require('../models/order');

