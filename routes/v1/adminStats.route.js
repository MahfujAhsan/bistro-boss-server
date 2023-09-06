const express = require('express');
const adminStatsController = require('../../controllers/adminStats.controller');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyAdmin = require('../../middleware/verifyAdmin');
const router = express.Router();

router.route('/')
    .get(verifyJWT, verifyAdmin, adminStatsController.getAdminStats)

module.exports = router;