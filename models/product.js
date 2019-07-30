const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    class: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    parameters: {
        measureSystem: { type: String, required: false },
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

module.exports = mongoose.model('Product', productSchema);