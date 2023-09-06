const Review = require('../models/reviewModel.js'); // Import your Review model

module.exports.getGeneralReviews = async (req, res, next) => {
    try {
        // Use Mongoose to find all reviews
        const reviews = await Review.find();

        // Respond with the list of reviews
        res.status(200).json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err);
    }
};

module.exports.getReviewsByEmail = async (req, res, next) => {
    try {
        const email = req.query.email;

        // Check if email is provided in the query parameter
        if (!email) {
            return res.status(200).json([]);
        }

        // Decode the email from the JWT
        const decodedEmail = req.decoded.email;

        // Check if the provided email matches the decoded email from the JWT
        if (email !== decodedEmail) {
            return res.status(403).json({ error: true, message: 'Forbidden access' });
        }

        // Use Mongoose to find reviews by email
        const reviews = await Review.find({ email });

        // Respond with the list of reviews
        res.status(200).json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err);
    }
};

module.exports.createReview = async (req, res, next) => {
    try {
        const reviewData = req.body;

        // Create a new instance of the Review model with the review data
        const newReview = new Review(reviewData);

        // Save the new review to the database
        const savedReview = await newReview.save();

        // Respond with the saved review
        res.status(201).json(savedReview);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err);
    }
};