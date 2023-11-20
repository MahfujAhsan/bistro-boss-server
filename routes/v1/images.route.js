const express = require('express');
const imagesController = require('../../controllers/images.controller');
const router = express.Router();

router.route('/')
    .get(imagesController.getImages)

router.route('/upload')
    .post(imagesController.handleImageUpload)

module.exports = router;