const mongoose = require('mongoose');

const beneficiary = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    adhar: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        default: Date.now
    },
    age: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    hash: {
        type: String
    }
})

module.exports = mongoose.model('Beneficiary', beneficiary);