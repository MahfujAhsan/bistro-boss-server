const mongoose = require('mongoose');

// Define the Booking Schema
const bookingSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        guest: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'booking'
    }
);

// Create the Booking model
const Booking = mongoose.model('booking', bookingSchema);

module.exports = Booking;