const express = require('express');
const paymentIntendedController = require('../../controllers/paymentIntended.controller');
const verifyJWT = require('../../middlewares/verifyJWT');
const router = express.Router();

router.route('/')
    .post(verifyJWT, paymentIntendedController.createPaymentIntent)

module.exports = router;