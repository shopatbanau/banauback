const mongoose = require('mongoose');
const Review = require('./Review-Model');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    category: [{
        type: String,
    }],
    subcategories: [{
        type: String,
    }],
    // need to deal with price oncce variant is introduced 
    price: {
        type: Number
    },
    image: {
        imageUrl: { type: String },
        imageID: { type: String }
    },
    //discount field 
    priceVariant: {
        type: String,
    },
    // image: {
    //     imageId: { type: String },
    //     imageUrl: { type: String }
    // },
    rating: {
        type: Number,
        default: 0
    },

    variant: [{
        name: {
            type: String,
            default: 'default'
        },
        options: [{
            name: {
                type: String,
                default: 'true'
            },
            price: {
                type: Number,
                default:0,
            },
            image: {
                imageID: { type: String },
                imageUrl: { type: String },
            },
            discount: {
                type: Number,
                default: 0
            },
            count: {
                type: Number,
                default:1,
            }
        }]
    }],

    //analytics

    //todo make another model for this 
    soldQuantity: {
        type: Number,
        default: 0
    },
    revenueGenerated: {
        type: Number,
        default: 0
    },
    inventory: {
        type: Number,
        default: 1
    },// total amount of stocks of quantity 
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    discount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

productSchema.pre('remove', async function (next) {
    try {
        await Review.deleteMany({ _id: { $in: this.review } });
    } catch (err) {
        next(err); // Propagate any errors
    }
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;
