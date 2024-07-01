const express = require('express');
const { CreateReview, GetReviewForProduct, UpdateReview, DeleteReview } = require('../Controller/Review-Controller');
const router = express.Router();

router.post('/products/:productId/reviews',CreateReview);
router.get('/products/:productId/reviews',GetReviewForProduct);
router.put('/products/:productId/reviews/:reviewId',UpdateReview);
router.delete('/products/:productId/reviews/:reviewId',DeleteReview);

module.exports =router