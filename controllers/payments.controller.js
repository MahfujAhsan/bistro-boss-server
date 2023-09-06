const Payment = require('../models/paymentModel'); // Import your Payment model
const Cart = require('../models/cartsModel'); // Import your Cart model

module.exports.createPaymentAndDeleteCartItems = async (req, res, next) => {
    try {
        const paymentData = req.body;

        // Create a new instance of the Payment model with the payment data
        const newPayment = new Payment(paymentData);

        // Save the new payment to the database
        const savedPayment = await newPayment.save();

        // Extract cart item IDs from the payment data
        const cartItemIds = paymentData.cartItems.map(id => mongoose.Types.ObjectId(id));

        // Use Mongoose to delete cart items by their IDs
        const deleteResult = await Cart.deleteMany({ _id: { $in: cartItemIds } });

        res.status(201).json({ payment: savedPayment, cartItemDeletions: deleteResult });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err);
    }
};

module.exports.getPaymentsByEmail = async (req, res, next) => {
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

        // Use Mongoose to find payments by email
        const payments = await Payment.find({ email });

        // Respond with the list of payments
        res.status(200).json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err);
    }
};
