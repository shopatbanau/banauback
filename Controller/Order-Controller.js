const Store = require('../Model/Store-model');
const Product = require('../Model/Product-model');
const Order = require('../Model/Order-model');
const EsewaTransaction = require('../Model/Esewa-model');
const mongoose = require('mongoose');
const { response } = require('express');
const crypto = require("crypto");
const Banau = require("../Model/Banau");

require('dotenv').config();



const createOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const {
                fullName,
                phoneNumber,
                email,
                cart,
                price,
                totalPrice,
                deliveryCharge,
                promoCode,
                promoDiscount,
                address,
                landmark,
                paymentMethod,
                esewaTransactionID
            } = req.body.orderData;
            console.log(req.body.orderData, "herhere");
            const storeID = req.params.storeID;

            // Validate required fields
            if (!fullName || !phoneNumber || !cart || cart.length === 0 || !price || !totalPrice) {
                throw new Error('Missing required fields');
            }

            // Validate and populate products in the cart
            // Validate and populate products in the cart
            // Validate and populate products in the cart
            const populatedCart = await Promise.all(cart.map(async item => {
                const product = await Product.findById(item.product).session(session);
                if (!product) {
                    throw new Error(`Product with ID ${item.product} not found`);
                }
                item.productName = product.name;
                console.log("item10-1", item.selectedVariant[0].options?.name);
                // Check for stock availability
                if (!item.selectedVariant || item.selectedVariant.length === 0 || item.selectedVariant[0].name === 'default' || item.selectedVariant[0].options?.name === 'default') {
                    // Default to handling without variants
                    if (item.count > product.inventory) {
                        throw new Error(`Product with ID ${item.product} is out of stock`);
                    }
                }
                else {
                    // Non-default variant scenario
                    const variant = product.variant.find(v => v.name === item.selectedVariant[0].name);
                    if (!variant) {
                        throw new Error(`Variant ${item.selectedVariant[0].name} not found for product with ID ${item.product}`);
                    }

                    console.log("item is ", item);
                    console.log("variant is ", variant);
                    console.log("option is", item?.selectedVariant[0]?.options);

                    // Skip validation if variant or option name is 'default'
                    if (item.selectedVariant[0].name !== 'default' && item.selectedVariant[0].options.name !== 'default') {
                        const option = variant.options.find(o => o.name === item.selectedVariant[0].options.name);
                        if (!option) {
                            // throw new Error(`Option ${item.selectedVariant[0].options.name} not found in variant ${item.selectedVariant[0].name} for product with ID ${item.product}`);
                        }

                        if (item.count > option.count) {
                            throw new Error(`Option ${item.selectedVariant[0].options.name} in variant ${item.selectedVariant[0].name} for product with ID ${item.product} is out of stock`);
                        }
                    }
                }

                return {
                    ...item,
                    product: product._id
                };
            }));

            // Validate Esewa transaction if payment method is Esewa
            if (paymentMethod === 'Esewa' && esewaTransactionID) {
                const transaction = await EsewaTransaction.findById(esewaTransactionID).session(session);
                if (!transaction) {
                    throw new Error('Invalid Esewa transaction ID');
                }
            }
            console.log("populated is",populatedCart);
            // Create order document
            const newOrder = new Order({
                fullName,
                phoneNumber,
                email,
                cart: populatedCart,
                price,
                totalPrice,
                deliveryCharge,
                promoCode,
                promoDiscount,
                address,
                landmark,
                paymentMethod,
                esewaTransactionID,
                store: storeID
            });

            // Save order to the database
            const savedOrder = await newOrder.save({ session });

            // Add the order to the store's orders array
            const store = await Store.findById(storeID).session(session);
            if (!store) {
                throw new Error(`Store with ID ${storeID} not found`);
            }
            store.orders.push(savedOrder._id);

            // Update store revenue and due/pending amounts
            if (paymentMethod === 'CashOnDelivery' || paymentMethod === 'esewa') {
                if (paymentMethod === 'CashOnDelivery') {
                    store.revenueGenerated += totalPrice;
                    const dueAmountIncrease = 0.03 * totalPrice;
                    store.dueAmount += dueAmountIncrease;
                } else if (paymentMethod === 'esewa') {
                    store.revenueGenerated += totalPrice;
                    const pendingAmountIncrease = 0.97 * totalPrice;
                    store.pendingAmount += pendingAmountIncrease;


                    // Update Banau storeSales
                    const banau = await Banau.findOne({ name: 'Banau' });
                    if (banau) {
                        banau.sales += pendingAmountIncrease;
                        const storeSale = banau.storeSales.find(s => s.storeName === store.name);
                        if (storeSale) {
                            storeSale.revenueGenerated += pendingAmountIncrease;
                        } else {
                            banau.storeSales.push({
                                storeName: store.name,
                                revenueGenerated: pendingAmountIncrease
                            });
                        }
                        await banau.save();
                    }
                }

                // Check if the order phone number is unique
                const isUniquePhoneNumber = await Order.countDocuments({ phoneNumber }).session(session) === 1;
                if (isUniquePhoneNumber) {
                    store.customers += 1;
                }

                // Update stock counts and sold quantities
                await Promise.all(cart.map(async item => {
                    const product = await Product.findById(item.product).session(session);
                    if (!product) {
                        throw new Error(`Product with ID ${item.product} not found`);
                    }

                    if (!item.selectedVariant || item.selectedVariant.length === 0 || item.selectedVariant[0].name === 'default' || item.selectedVariant[0]?.options.name === 'default') {
                        // Default scenario: no variants specified
                        product.inventory -= item.count;
                        product.soldQuantity += item.count;
                        product.revenueGenerated += item.count * item.price;
                    } else {
                        // Non-default variant scenario
                        const variant = product.variant.find(v => v.name === item.selectedVariant[0].name);
                        if (!variant) {
                            throw new Error(`Variant ${item.selectedVariant[0].name} not found for product with ID ${item.product}`);
                        }

                        const option = variant.options.find(o => o.name === item.selectedVariant[0].options.name);
                        if (!option) {
                            throw new Error(`Option ${item.selectedVariant[0].options.name} not found in variant ${item.selectedVariant[0].name} for product with ID ${item.product}`);
                        }

                        option.count -= item.count;
                        product.soldQuantity += item.count;
                        product.revenueGenerated += item.count * option.price;
                    }

                    await product.save({ session });

                    // Update most sold item for the store
                    const mostSoldProduct = await Product.findById(store.mostSoldItem).session(session);
                    if (!mostSoldProduct) {
                        store.mostSoldItem = item.product;
                    } else if (mostSoldProduct.soldQuantity < product.soldQuantity) {
                        store.mostSoldItem = item.product;
                    }
                }));

                await store.save({ session });

                // Return the saved order or formData based on payment method
                if (paymentMethod === 'CashOnDelivery') {
                    res.status(201).json(savedOrder);
                } else if (paymentMethod === 'esewa') {
                    const signature = createSignature(
                        `total_amount=${savedOrder.totalPrice},transaction_uuid=${savedOrder._id},product_code=${process.env.PRODUCT_CODE}`
                    );
                    const formData = {
                        amount: totalPrice,
                        failure_url: req.body.fail || process.env.FAILURE_URL,
                        product_delivery_charge: "0",
                        product_service_charge: "0",
                        product_code: process.env.PRODUCT_CODE,
                        signature: signature,
                        signed_field_names: "total_amount,transaction_uuid,product_code",
                        success_url: req.body.success || process.env.SUCCESS_URL,
                        tax_amount: "0",
                        total_amount: savedOrder.totalPrice,
                        transaction_uuid: savedOrder._id,
                    };
                    res.json({ message: "Order Created Successfully", payment: savedOrder, formData });
                }
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: error.message });
    } finally {
        session.endSession();
    }
}


const createSignature = (message) => {

    const secret = process.env.SECRET;
    // Create an HMAC-SHA256 hash
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(message);

    // Get the digest in base64 format
    const hashInBase64 = hmac.digest("base64");
    return hashInBase64;

};


const getOrdersByStore = async (req, res) => {
    const { storeID } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchTerm = req.query.search || '';
    const skip = (page - 1) * limit;

    console.log('Store ID:', storeID);
    console.log('Page:', page, 'Limit:', limit, 'Search Term:', searchTerm);
    try {
        // Initialize search conditions
        const searchConditions = [];

        // Split search terms by comma and trim spaces
        const searchTerms = searchTerm.split(',').map(term => term.trim());
        console.log(searchTerms);
        // Only add search conditions if search terms are provided
        if (searchTerms.length > 0) {
            searchTerms.forEach(term => {
                const termConditions = [
                    { fullName: { $regex: term, $options: 'i' } },
                    { address: { $regex: term, $options: 'i' } },
                    { landmark: { $regex: term, $options: 'i' } },
                    { email: { $regex: term, $options: 'i' } },
                    { phoneNumber: { $regex: term, $options: 'i' } },
                    { 'cart.productName': { $regex: term, $options: 'i' } },
                    { status: { $regex: term, $options: 'i' } }
                ];

                if (mongoose.Types.ObjectId.isValid(term)) {
                    termConditions.push({ _id: term });
                }

                searchConditions.push({ $or: termConditions });
            });
        }

        // Populate orders with or without search conditions and sort by _id descending (latest first)
        const store = await Store.findById(storeID)
            .populate({
                path: 'orders',
                match: searchConditions.length ? { $and: searchConditions } : {},
                options: {
                    skip,
                    limit,
                    sort: { _id: -1 }, // Sort by _id descending
                    select: '-deliveryCode', // Exclude deliveryCode
                },
                populate: {
                    path: 'cart.product',
                    model: 'Product'
                }
            });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Calculate total orders with or without search conditions
        const totalOrders = await Order.countDocuments({
            store: storeID,
            ...(searchConditions.length ? { $and: searchConditions } : {})
        });

        res.json({
            orders: store.orders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders
        });
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({ message: 'Fetching orders failed, please try again later.', error: error.message });
    }
};

const updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const { status, deliveryCode, fullName, address, landmark, phoneNumber } = req.body;
    console.log(req.params);
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log("object");
    try {
        // Validate if orderId is valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        // Fetch the order to check the deliveryCode within the transaction
        const order = await Order.findById(orderId).session(session);
        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Order not found' });
        }
        const storeID = req.params.storeID || order.store;
        console.log(storeID);
        // Check if order is already delivered
        if (order.status === 'Delivered') {
            await session.abortTransaction();
            return res.status(403).json({ message: "Delivered Order can no longer be updated" });
        }

        // Prepare the update object including deliveryCode if provided
        const updateData = { status, fullName, address, landmark, phoneNumber };
        if (deliveryCode) {
            updateData.deliveryCode = deliveryCode;
        }

        // Handle order cancellation scenario
        if (status === 'Cancelled') {
            if (order.paymentMethod === 'esewa') {
                return res.status(405).json({ message: 'Orders Paid With Esewa Can Not be cancelled , please contact banau staff for further assistance' });
            }
            // Update the order status to Cancelled
            updateData.status = 'Cancelled';
            console.log("order is", order);
            // Update store metrics
            const store = await Store.findById(storeID).session(session);
            if (!store) {
                await session.abortTransaction();
                return res.status(404).json({ message: `Store with ID ${storeID} not found` });
            }

            if (order.paymentMethod === 'CashOnDelivery') {
                // Adjust store revenue and due amount
                store.revenueGenerated -= order.totalPrice;
                const dueAmountDecrease = 0.03 * order.totalPrice;
                store.dueAmount -= dueAmountDecrease;
            } else if (order.paymentMethod === 'esewa') {
                store.revenueGenerated -= order.totalPrice;
                const pendingAmountIncrease = 0.03 * order.totalPrice;
                store.pendingAmount += pendingAmountIncrease;
                // Update Banau storeSales
                const banau = await Banau.findOne({ name: 'Banau' });
                if (banau) {
                    banau.sales -= pendingAmountIncrease;
                    const storeSale = banau.storeSales.find(s => s.storeName === store.name);
                    if (storeSale) {
                        storeSale.revenueGenerated -= pendingAmountIncrease;
                    }
                    // else case should not be possible?
                    await banau.save();
                }
            }

            // Check if the order phone number is unique and adjust customer count
            const isUniquePhoneNumber = (await Order.countDocuments({ phoneNumber: order.phoneNumber }).session(session)) === 1;
            if (isUniquePhoneNumber) {
                store.customers -= 1;
            }

            await store.save({ session });

            // Update product data (reverse changes made during order creation)


        }

        // Update the order status and other fields in the database
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true, session, runValidators: true }
        );

        await session.commitTransaction();
        res.json({ message: 'Order updated successfully', updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error.message);
        await session.abortTransaction();
        res.status(500).json({ message: 'Failed to update order', error: error.message });
    } finally {
        session.endSession();
    }
};








module.exports = { createOrder, getOrdersByStore, updateOrder };



