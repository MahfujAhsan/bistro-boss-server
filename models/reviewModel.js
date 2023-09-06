const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        details: {
            likedRecipe: String,
            reviewDetail: String,
            suggestion: String,
        },
        rating: {
            type: Number,
            required: true,
            min: 1, // Minimum rating value
            max: 5, // Maximum rating value
        },
    },
    {
        collection: 'reviews'
    }
);

const Review = mongoose.model('reviews', reviewSchema);

module.exports = Review