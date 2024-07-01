// CRUD operations for Review embedded within Product

const { default: mongoose } = require("mongoose");
const Product = require("../Model/Product-model");
const Review = require("../Model/Review-Model");

// Create a review for a specific product
const CreateReview = async (req, res) => {
  const { productId } = req.params;
  const { name, rating, description } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const review = new Review({ name, rating, description });
    const reviewData = await review.save();

    product.review.push(reviewData._id);
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all reviews for a specific product
const GetReviewForProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId).populate("review");
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product.review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// // Update a specific review for a specific product
const UpdateReview = async (req, res) => {
  const { productId, reviewId } = req.params;
  const { name, rating, description } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Update review details
    review.name = name;
    review.rating = rating;
    review.description = description;

    const updatedReview = await review.save();



    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Delete a specific review for a specific product
const DeleteReview = async (req, res) => {
  const { productId, reviewId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product Not Found" });
    }

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review Not Found" });
    }

    // Update product reviews using Mongoose comparison
    product.review = product.review.filter(n => n.toString() !== reviewId.toString());
    await product.save();

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  CreateReview,
  GetReviewForProduct,
  UpdateReview,
  DeleteReview
}