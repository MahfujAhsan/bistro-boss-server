const express = require('express');
const paymentsController = require('../../controllers/payments.controller');
const verifyJWT = require('../../middleware/verifyJWT');
const router = express.Router();

router.route('/')
    .get(verifyJWT, paymentsController.getPaymentsByEmail)
    .post(verifyJWT, paymentsController.createPaymentAndDeleteCartItems)

module.exports = router;


