const User = require('../models/userModel'); // Import your User model
const MenuItem = require('../models/menuModel'); // Import your MenuItem model
const Payment = require('../models/paymentModel'); // Import your Payment model

module.exports.getAdminStats = async (req, res, next) => {
    try {
        // Get the count of users
        const users = await User.estimatedDocumentCount();

        // Get the count of products (menu items)
        const products = await MenuItem.estimatedDocumentCount();

        // Get the count of orders (payments)
        const orders = await Payment.estimatedDocumentCount();

        // Get all payments and calculate total revenue
        // const payments = await Payment.find().toArray();
        const payments = await Payment.find({});
        const revenue = payments.reduce((sum, payment) => sum + payment.price, 0);

        res.status(200).json({ users, products, orders, revenue });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err);
    }
};