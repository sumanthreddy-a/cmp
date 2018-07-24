const mongoose = require('mongoose');

const scheme = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
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
    beneficiary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beneficiary'
    },
    hash:{
        type: String
    }
})

module.exports = mongoose.model('Scheme', scheme);