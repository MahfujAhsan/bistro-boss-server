const express = require('express');
const reviewsController = require('../../controllers/reviews.controller');
const verifyJWT = require('../../middleware/verifyJWT');

const router = express.Router();

router.route('/')
    .get(verifyJWT, reviewsController.getReviewsByEmail)
    .post(verifyJWT, reviewsController.createReview)

router.route('/general')
    .get(reviewsController.getGeneralReviews)

module.exports = router;