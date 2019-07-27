const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const photoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    parameters: {
        width: { type: Number, required: false },
        height: { type: Number, required: false }
    },
    price: {
        type: Number,
        required: true
    },
    author: {
        fullName: {
            firstname: { type: String, required: false },
            lastName: { type: String, required: false }
        },
        link: {
            type: String,
            required: false
        }
    },
    imageURL: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('photo', photoSchema);

