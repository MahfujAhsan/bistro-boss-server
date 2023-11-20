const multer = require('multer');
const Image = require('../models/imageModel');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadImage = upload.single('image');

module.exports.handleImageUpload = async (req, res) => {
    try {
        uploadImage(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // Multer error handling
                return res.status(400).json({ message: 'Multer error: ' + err.message });
            } else if (err) {
                // Other errors
                return res.status(500).json({ message: 'Error uploading file: ' + err.message });
            }

            // File upload successful
            const newImage = new Image({
                imageName: req?.file?.originalname,
                imageData: req?.file?.buffer,
                contentType: req?.file?.mimetype
            });

            // Save the image to the database
            await newImage.save();

            // Send a success response
            res.status(201).json({ message: 'Image uploaded successfully', image: newImage });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

module.exports.getImages = async (req, res) => {
    try {
        const images = await Image.find({});
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving images', error: error.message });
    }
};