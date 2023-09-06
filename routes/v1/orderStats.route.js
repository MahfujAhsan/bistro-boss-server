const express = require('express');
const orderStatsController = require('../../controllers/orderStats.controller');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyAdmin = require('../../middleware/verifyAdmin');
const router = express.Router();

router.route('/')
    .get(verifyJWT, verifyAdmin, orderStatsController.getOrderStats)

module.exports = router;