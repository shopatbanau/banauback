const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: {
        type: String
    },
    rating: {
        type: Number
    },
    description: {
        type: String
    }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
