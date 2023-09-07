const Booking = require('../models/bookingModel');
const { getDb } = require('../utils/dbConnect');

module.exports.getBookings = async (req, res, next) => {
    try {
        const email = req.query.email;

        // If no email is provided, respond with an empty array
        if (!email) {
            return res.status(200).json([]);
        }

        const decodedEmail = req.decoded.email;

        // Check if the provided email matches the decoded email
        if (email !== decodedEmail) {
            return res.status(403).json({ error: true, message: 'Forbidden access' });
        }

        // Use Mongoose to query the database for bookings with the provided email
        const bookings = await Booking.find({ email });

        // Respond with the bookings
        res.status(200).json(bookings);
    } catch (err) {
        // console.error(error);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err)
    }
}

// module.exports.saveABooking = (req, res) => {
//     res.send("booking saved")
// };

module.exports.saveABooking = async (req, res, next) => {
    try {
        const bookingData = req.body;

        // Create a new booking instance using the Mongoose model
        const booking = new Booking(bookingData);

        // Save the booking to the database
        const result = await booking.save();

        // Respond with the result
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err)
    }
}

module.exports.getSingleBooking = (req, res) => {
    res.send("booking by id")
};

module.exports.deleteBookingItem = async (req, res, next) => {
    try {
        const bookingItemId = req.params.id;

        // Use Mongoose to find and delete the cart item by its ID
        const deletedBookingItem = await Booking.findByIdAndRemove(bookingItemId);

        if (!deletedBookingItem) {
            // If the cart item doesn't exist, respond with an error
            return res.status(404).json({ error: true, message: 'Booking item not found' });
        }

        // Respond with a success message or deleted item information
        res.status(200).json({ message: 'Cart item deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err);
    }
};