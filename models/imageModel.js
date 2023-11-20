const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageName: {
        type: String,
        required: true
    },
    imageData: {
        type: Buffer, // Store image data as binary data
        required: true
    },
    contentType: {
        type: String,
        required: true
    }
})

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;