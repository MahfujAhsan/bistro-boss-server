const express = require('express');
const adminStatsController = require('../../controllers/adminStats.controller');
const verifyJWT = require('../../middlewares/verifyJWT');
const verifyAdmin = require('../../middlewares/verifyAdmin');
const router = express.Router();

router.route('/')
    .get(verifyJWT, verifyAdmin, adminStatsController.getAdminStats)

module.exports = router;