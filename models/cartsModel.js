const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        menuItemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'MenuItem', // Assuming there's a MenuItem model
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'carts'
    }
);

const Cart = mongoose.model('carts', cartSchema);

module.exports = Cart;
