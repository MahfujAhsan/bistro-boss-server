const Cart = require('../models/cartsModel'); // Import your Cart model

module.exports.getCartsByEmail = async (req, res, next) => {
    try {
        const email = req.query.email;

        // Check if email is provided in the query parameter
        if (!email) {
            return res.status(200).json([]);
        }

        // Decode the email from the JWT
        const decodedEmail = req.decoded.email;

        // Check if the provided email matches the decoded email from the JWT
        if (email !== decodedEmail) {
            return res.status(403).json({ error: true, message: 'Forbidden access' });
        }

        // Use Mongoose to find carts by email
        const carts = await Cart.find({ email });

        // Respond with the list of carts
        res.status(200).json(carts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err);
    }
};

module.exports.createCartItem = async (req, res, next) => {
    try {
        const cartItemData = req.body;

        // Create a new instance of the Cart model with the cart item data
        const newCartItem = new Cart(cartItemData);

        // Save the new cart item to the database
        const savedCartItem = await newCartItem.save();

        // Respond with the saved cart item
        res.status(201).json(savedCartItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err);
    }
};

module.exports.deleteCartItem = async (req, res, next) => {
    try {
        const cartItemId = req.params.id;

        // Use Mongoose to find and delete the cart item by its ID
        const deletedCartItem = await Cart.findByIdAndRemove(cartItemId);

        if (!deletedCartItem) {
            // If the cart item doesn't exist, respond with an error
            return res.status(404).json({ error: true, message: 'Cart item not found' });
        }

        // Respond with a success message or deleted item information
        res.status(200).json({ message: 'Cart item deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err);
    }
};
