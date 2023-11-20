const express = require('express');
const cartsController = require('../../controllers/carts.controller');
const verifyJWT = require('../../middlewares/verifyJWT');
const router = express.Router();

router.route('/')
    .get(verifyJWT, cartsController.getCartsByEmail)
    .post(cartsController.createCartItem)

router.route('/:id')
    .delete(cartsController.deleteCartItem)

module.exports = router;