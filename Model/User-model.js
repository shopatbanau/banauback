const mongoose = require('mongoose');
const Store = require('./Store-model');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    verificationCode: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    stores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],

    isBanauAdmin: { type: Boolean, default: false, index: true }, //staff or employees for banau
    banauRoles: {
        role: {
            type: String,
            enum: ['Owner', 'Admin', 'Staff', 'Delivery', 'Manager', ''],
            default: ''
        }
    },

    roles: [{
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store',
            required: true // Ensuring that storeId is always provided
        },
        role: {
            type: String,
            enum: ['Owner', 'Admin', 'Staff', 'Delivery'],
            default: 'staff'
        }
    }]
});



const User = mongoose.model('User', userSchema);

module.exports = User;
