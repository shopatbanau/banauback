// please install better comments from vs code 



/* 
* Product conmtroller needs to be updated
TODO : productAnalytics has to be it's own model and I have made a rating model so the controller needs to be updated to deal with that
! error
store-controller change static data for user

*/

/*

require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan'); // Import Morgan
const userRoute = require('./Routes/User-Routes');
const storeRoute = require('./Routes/Store-Routes');
const productRoute = require('./Routes/Product-Routes');
const reviewRoute = require('./Routes/Review-Route');
const orderRoute = require('./Routes/Order-Route');
const paymentRoute = require('./Routes/Payment-Route');
const Store = require('./Models/Store'); // Import the Store model

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('combined')); // Use Morgan for logging

// MongoDB connection and update script
console.log(process.env.DB_URL);

mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        console.log('MongoDB connected successfully');
        
        // Update existing stores to add componentSkin field if not already present
        try {
            await Store.updateMany(
                { componentSkin: { $exists: false } },
                {
                    $set: {
                        componentSkin: [
                            { component: "Navbar", skinType: "Navbar", activeSkin: "" },
                            { component: "Product1", skinType: "Card", activeSkin: "" },
                            { component: "Product2", skinType: "Card", activeSkin: "" },
                            { component: "Product3", skinType: "Card", activeSkin: "" },
                            { component: "Banner1", skinType: "Banner", activeSkin: "" },
                            { component: "Banner2", skinType: "Banner", activeSkin: "" },
                            { component: "Banner3", skinType: "Banner", activeSkin: "" },
                            { component: "Footer", skinType: "Footer", activeSkin: "" },
                            { component: "Background", skinType: "Background", activeSkin: "" }
                        ]
                    }
                }
            );
            console.log('componentSkin field updated for existing stores');
        } catch (err) {
            console.error('Error updating componentSkin field:', err);
        }

        // Start the server only when MongoDB connection is successful
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Routes here
app.use('/api/users', userRoute);
app.use('/api/store', storeRoute);
app.use('/api/product', productRoute);
app.use('/api/review', reviewRoute);
app.use('/api/order', orderRoute);
app.use('/api/payment', paymentRoute);

*/