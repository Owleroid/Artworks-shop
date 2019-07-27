const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    urlTitle: {
        type: String,
        required: true
    },
    mainImg: {
        type: String,
        required: true
    },
    article: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Article', articleSchema);