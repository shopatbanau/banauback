const mongoose = require('mongoose');
const EsewaTransaction = require('../Model/Esewa-model');
const crypto = require("crypto");
const Payment = require('../Model/Payment-Model');
require('dotenv').config();

const createPayment = async (req, res) => {
    try {
        console.log(req.body);  // Check if req.body has the required data

        // Save the payment data using the Payment model
        const newEsewaTransaction = new EsewaTransaction(req.body.data);
        const savedEsewaTransaction = await newEsewaTransaction.save();

        // Assuming you need data from savedPayment for formData
        const signature = createSignature(
            `total_amount=${savedEsewaTransaction.amount},transaction_uuid=${savedEsewaTransaction._id},product_code=${process.env.PRODUCT_CODE}`
        );
        const formData = {
            amount: savedEsewaTransaction.amount,
            failure_url: req.body.fail || process.env.FAILURE_URL,
            product_delivery_charge: "0",
            product_service_charge: "0",
            product_code: process.env.PRODUCT_CODE,
            signature: signature,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            success_url: req.body.success || process.env.SUCCESS_URL,
            tax_amount: "0",
            total_amount: savedEsewaTransaction.amount,
            transaction_uuid: savedEsewaTransaction._id,
        };

        res.json({ message: "Order Created Successfully", payment: savedEsewaTransaction, formData });
    } catch (err) {
        return res.status(400).json({ error: err?.message || "Error creating order" });
    }
};

const createSignature = (message) => {
    const secret = process.env.SECRET;
    // Create an HMAC-SHA256 hash
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(message);

    // Get the digest in base64 format
    const hashInBase64 = hmac.digest("base64");
    return hashInBase64;
};

module.exports = { createPayment };
