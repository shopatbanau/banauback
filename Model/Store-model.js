const mongoose = require('mongoose');
const User = require('./User-model');
const Product = require('./Product-model');
const Order = require('./Order-model'); // Ensure to require the Order model if it's used in the pre-remove hook
const esewaTransactionSchema = require('./Esewa-model');

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true, unique: true }, // Indexed field
    logo: {
        logoUrl: { type: String },
        logoID: { type: String }
    },
    phoneNumber: { type: String },
    email: { type: String },
    categories: [{ name: { type: String, required: true } }],
    subCategories: [{ name: { type: String, required: true } }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    featuredProducts: [{ type: Number }],
    color: { type: Object },
    banner: {
        bannerUrl: { type: String },
        bannerID: { type: String }
    },
    secondaryBanner: {
        secondaryBannerUrl: { type: String },
        secondaryBannerID: { type: String }
    },
    thirdBanner: {
        thirdBannerUrl: { type: String },
        thirdBannerID: { type: String }
    },
    location: { type: String },
    address: { type: String },
    previewMode: { type: Boolean, default: true },
    socialMediaLinks: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String },
        linkedin: { type: String }
    },


    componentSkin: {
        type: [
            {
                component: { type: String },
                skinType: { type: String },
                activeSkin: { type: String },
                skinInventory: [{ type: String }],
            }
        ],
        default: [
            {
                component: "Navbar",
                skinType: "Navbar",
                activeSkin: "default",
                skinInventory: ["default"]
            },
            {
                component: "Product1",
                skinType: "Card",
                activeSkin: "default",
                skinInventory: ["default"]
            },
            {
                component: "Product2",
                skinType: "Card",
                activeSkin: "default",
                skinInventory: ["default"]
            },
            {
                component: "Product3",
                skinType: "Card",
                activeSkin: "default",
                skinInventory: ["default"]
            },
            {
                component: "Banner1",
                skinType: "Banner",
                activeSkin: "default",
                skinInventory: ["default"]
            },
            {
                component: "Banner2",
                skinType: "Banner",
                activeSkin: "default",
                skinInventory: ["default"]
            },
            {
                component: "Banner3",
                skinType: "Banner",
                activeSkin: "default",
                skinInventory: ["default"]
            },
            {
                component: "Footer",
                skinType: "Footer",
                activeSkin: "default",
                skinInventory: ["default"]
            },
            {
                component: "Background",
                skinType: "Background",
                activeSkin: "default",
                skinInventory: ["default"]
            }
        ]
    },

    inventory: { type: Number, default: 0 },
    revenueGenerated: { type: Number, default: 0 },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'esewaTransactionSchema' }], // subscrition / skin // 
    customers: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    mostSoldItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    visitors: { type: Number, default: 0 },
    conversitionRate: { type: Number, default: 0 },
    footerDescription: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    transactionLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TransactionLogs' }],
    subscriptionStatus: {
        type: String,
        enum: ['Silver', 'Gold', 'Platinum'],
        default: 'Silver'
    },
    logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Logs' }],
    subscriptionExpiry: {
        type: Date,
        default: null
    },

    activeTheme: { type: Number, default: 1 },
    secondaryBannerText: {
        heading: { type: String, default: "" },
        paragraph: { type: String, default: "" }
    },
    thirdBannerText: {
        heading: { type: String, default: "" },
        paragraph: { type: String, default: "" }
    },
    offerBanner: {
        offerBannerUrl: { type: String },
        offerBannerID: { type: String }
    },
    offerBannerText: {
        para1: { type: String, default: "" },
        para2: { type: String, default: "" },
        para3: { type: String, default: "" }
    },
    esewa: {
        accountNumber: { type: String, default: "" },
        qr: {
            imageUrl: { type: String, default: "" },
            imageID: { type: String, default: "" }
        }
    },
    bank: {
        accountNumber: { type: String, default: "" },
        fullname: { type: String, default: "" },
        qr: {
            imageUrl: { type: String, default: "" },
            imageID: { type: String, default: "" }
        }
    },
    khalti: {
        accountNumber: { type: String, default: "" },
        qr: {
            imageUrl: { type: String, default: "" },
            imageID: { type: String, default: "" }
        }
    },
    promoCode: [
        {
            name: { type: String },
            value: { type: Number, default: 0 }
        }
    ],
    isDisabled: { type: Boolean, default: false },
    fonts: { type: Object },
    expectedDeliveryTime: { type: String, default: '3 to 4 business days' },
    expectedDeliveryPrice: { type: Number, default: 100 },
    liveChatSource: { type: String, default: '' },
}, { timestamps: true });


// Middleware to prevent updating if the store is disabled
const checkStoreDisabled = async function (next) {
    try {
        // Skip the check if the custom property is set
        console.log(`[+] Options:`, this.options);
        if (this.options.skipDisabledCheck) {
            return next();
        }
        console.log(`[+] I am checkStoreDisabled `);
        const store = await this.model.findOne(this.getQuery());
        console.log(`[+] Check Is Disabled`, { name: store.name, isDisabled: store.isDisabled });
        if (store && store.isDisabled) {
            const error = new Error('[+] Store is disabled. Please pay the dueAmount to enable it.');
            error.status = 403;
            return next(error);
        }
        next();
    } catch (error) {
        next(error);
    }
};

// // Apply the middleware to various update operations
// storeSchema.pre('findOneAndUpdate', checkStoreDisabled);
// storeSchema.pre('findByIdAndUpdate', checkStoreDisabled);
// storeSchema.pre('updateOne', checkStoreDisabled);
// storeSchema.pre('updateMany', checkStoreDisabled);


// Mongoose middleware: Pre hook to check and update subscription status and expiry
storeSchema.pre('save', async function (next) {

    // Check if subscriptionExpiry is defined and if it has passed
    if (this.subscriptionExpiry && this.subscriptionExpiry <= new Date()) {
        this.subscriptionStatus = 'Silver'; // Set subscriptionStatus to Silver
        this.subscriptionExpiry = null; // Set subscriptionExpiry to null
    }
    // If isDisabled is true, throw an error
    // if (this.isDisabled) {
    //     console.log(`[+] I am pre save isDisabled `);
    //     const error = new Error('Please pay the dueAmount');
    //     next(error);
    // }

    next();
});

// Mongoose middleware: Post hook to check and update isDisabled field
storeSchema.post('save', async function (doc, next) {
    try {
        // Check if dueAmount exceeds 5000 and update isDisabled if necessary
        if (doc.dueAmount > 5000 && !doc.isDisabled) {
            console.log(`[+] I am post save isDisabled `);
            doc.isDisabled = true;
            await doc.save();
            console.log(`[+] Store has been disabled : `, { doc });
        }
        if (doc.dueAmount < 5000 && doc.isDisabled) {
            doc.isDisabled = true;
            await doc.save();
        }
        next();
    } catch (error) {
        next(error);
    }
});

storeSchema.pre('remove', async function (next) {
    try {
        await Order.deleteMany({ _id: { $in: this.orders } });
        await Product.deleteMany({ _id: { $in: this.products } });
        next();
    } catch (err) {
        next(err);
    }
});

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
