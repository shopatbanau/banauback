const mongoose = require('mongoose');
const Store = require('../Model/Store-model');
const User = require('../Model/User-model');


const logsSchema = new mongoose.Schema(
    {
        employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        pendingAmount: { type: Number, default: 0 },
        dueAmount: { type: Number, default: 0 },
        subscriptionStatus: {
            type: String,
            enum: ['Silver', 'Gold', 'Platinum'],
            default: 'Silver'
        },
        paymentReceived: { type: Number, default: 0 },
        paymentGiven: { type: Number, default: 0 },
        logDescription: {
            type: String
        },
        customerName: {
            type: String
        },
        store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
        paymentMethod: {
            type: String,
            enum: ['Bank', 'Esewa', 'Cash', 'Khalti'],
            default: 'Cash'
        }
    },
    {
        timestamps: true,
    }
);

const TransactionLogs = mongoose.model('TransactionLogs', logsSchema);

module.exports = TransactionLogs;
