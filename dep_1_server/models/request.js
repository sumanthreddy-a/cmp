const mongoose = require('mongoose');

const ReqSchema = new mongoose.Schema({
    whom: {
        type: String,
        required: true
    },
    what: {
        type: String,
        required: true,
    },
    when: {
        type: Date,
        default: Date.now
    },
    who: {
        type: String
    },
    reason: {
        type: String,
        required: true,
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
    hash:{
        type: String,
    },
    transactionId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Request', ReqSchema);