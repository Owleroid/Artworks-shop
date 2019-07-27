const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const artworkSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    parameters: {
        width: { type: Number, required: true },
        height: { type: Number, required: true }
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

module.exports = mongoose.model('artwork', artworkSchema);

