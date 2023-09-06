const express = require('express');
const paymentIntendedController = require('../../controllers/paymentIntended.controller');
const verifyJWT = require('../../middleware/verifyJWT');
const router = express.Router();

router.route('/')
    .post(verifyJWT, paymentIntendedController.createPaymentIntent)

module.exports = router;