const mongoose = require('mongoose');
const Store = require('../Model/Store-model');
const esewaTransactionSchema = new mongoose.Schema(
    {
        payment_method: {
            type: String,
            required: true,
            default: "esewa",
        },
        transaction_code: String,
        amount: {
            type: Number,
            required: true,
        },
        skin:{
            skinType:{type:String},
            name:{type:String},
        },
        subscription: {
            type: String,
            default: ''
        },
        store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
        status: {
            type: String,
            required: true,
            enum: ["created", "paid", "shipping", "delivered"],
            default: "created",
        },
        duration: {
            type: String,
            default: '',
        },
        used: {
            type: Boolean,
            default: false
        },

        address: String,
    },
    {
        timestamps: true,
    }
);

const EsewaTransaction = mongoose.model('EsewaTransaction', esewaTransactionSchema);

module.exports = EsewaTransaction;
