const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    date: {
        type: String
    },
    description: {
        type: String
    },
    amount: {
        type: String
    },
    extended_details: {
        type: String
    },
    appears_on_statement: {
        type: String
    },
    address: {
        type: String
    },
    city_state: {
        type: String
    },
    zip_code: {
        type: String
    },
    country: {
        type: String
    },
    reference: {
        type: String
    },
    category: {
        type: String
    }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;