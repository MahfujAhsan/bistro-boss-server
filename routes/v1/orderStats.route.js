const express = require('express');
const orderStatsController = require('../../controllers/orderStats.controller');
const verifyJWT = require('../../middlewares/verifyJWT');
const verifyAdmin = require('../../middlewares/verifyAdmin');
const router = express.Router();

router.route('/')
    .get(verifyJWT, verifyAdmin, orderStatsController.getOrderStats)

module.exports = router;