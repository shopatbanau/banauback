    const mongoose = require('mongoose');

    const banauSchema = new mongoose.Schema(
        {
            name: {
                type: String,
                index: true,
                unique: true,
            },
            sales: {
                type: Number,
                default: 0
            },
            staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            storeSales: [{
                storeName: { type: String },
                revenueGenerated: { type: Number },
            }]
        },
        {
            timestamps: true,
        }
    );

    // Middleware to prevent multiple documents
    banauSchema.pre('save', async function (next) {
        const Banau = mongoose.model('Banau');
        // Check if the document is new
        if (this.isNew) {
            const count = await Banau.countDocuments();
            if (count >= 1) {
                console.log(`[+] Checked Whether New Document Banau Creation ❌`);
                throw new Error("[-] Only one Banau document is allowed");
            }
        }
        console.log(`[+] Checked Whether New Document Banau Creation ✅`);
        next();
    });
    const Banau = mongoose.model('Banau', banauSchema);

    module.exports = Banau;
