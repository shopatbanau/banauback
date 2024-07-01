const mongoose = require('mongoose');
const Product = require('./Product-model');
const EsewaTransaction = require('./Esewa-model');

const orderSchema = new mongoose.Schema({
    // Customer details
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true, index: true },
    email: { type: String, match: /.+\@.+\..+/ },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    // Order status
    status: {
        type: String,
        enum: ['Processing', 'Confirmed', 'Being delivered', 'Delivered', 'Cancelled', 'Returned'],
        default: 'Processing',
        index: true
    },

    // Product details
    cart: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: { type: String },
        price: { type: Number, required: true }, // this should already include discounted price //discount price

        discountAmount: { type: Number, default: 0 },
        count: { type: Number, required: true, default: 1 },
        selectedVariant: [{
            name: { type: String, required: true, default: 'default' },
            options: { name: { type: String, required: true, default: 'default' } }
        }]
    }],

    // Amount details
    price: { type: Number, required: true }, // total added price (already discounted)
    deliveryCharge: { type: Number, default: 0 },
    // Promo details
    promoCode: { type: String },
    promoDiscount: { type: Number },
    totalPrice: { type: Number, required: true }, // after discount + delivery charge - promo discount
    // Location details
    address: { type: String, required: true },
    landmark: { type: String },
    // Payment details
    paymentMethod: { type: String, default: 'CashOnDelivery' },
    esewaTransactionID: { type: mongoose.Schema.Types.ObjectId, ref: 'EsewaTransaction' },
    //secretKey
    deliveryCode: { type: String, required: true, unique: true, default: generateDeliveryCode },
}, {
    timestamps: true
});

// Function to generate a unique delivery code
function generateDeliveryCode() {
    // Implement your code generation logic here
    // Example: Generate a random alphanumeric code
    const length = 4;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
}

// Indexes
orderSchema.index({ phoneNumber: 1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
