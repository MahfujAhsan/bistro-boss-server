const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        quantity: {
            type: Number,
            required: true,
        },
        cartItems: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart', // Assuming there's a Cart model
        }],
        menuItems: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem', // Assuming there's a MenuItem model
        }],
        status: {
            type: String,
            enum: ['Service Pending', 'Payment Complete', 'Refunded'],
            default: 'Service Pending',
        },
        itemNames: [String],
    },
    {
        collection: 'payments'
    }
);

const Payment = mongoose.model('payments', paymentSchema);

module.exports = Payment;