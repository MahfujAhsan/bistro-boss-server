const Booking = require('../models/bookingModel');
const { getDb } = require('../utils/dbConnect');

// const bookingCollection = getDb.collection('booking');

// module.exports.getBookings = async (req, res, next) => {
//     // const booking = req.body;
//     // const result = await getDb.collection('booking').bookingCollection.insertOne(booking);
//     // res.send(result);
//     // try {
//     //     const db = getDb();
//     //     const email = req.query.email;
//     //         if(!email) {
//     //             res.send([])
//     //         }

//     //         const decodedEmail = req.decoded.email;
//     //         if(email !== decodedEmail) {
//     //             return res.send(403).send({error: true, message: 'forbidden access'});
//     //         }

//     //         const query = {email: email};
//     //         const result = await db.collection("booking").find(query).toArray();
//     //         res.send(result);
//     // } catch (err) {

//     // };
//     const email = req.query.email;

//     if (!email) {
//         return res.status(200).send([]); // Respond with an empty array if no email is provided
//     }

//     const decodedEmail = req.decoded.email;

//     if (email !== decodedEmail) {
//         return res.status(403).json({ error: true, message: 'Forbidden access' });
//     }

//     try {
//         // Use Mongoose to query the database for bookings with the provided email
//         const bookings = await Booking.find({ email });

//         // Respond with the bookings
//         res.status(200).json(bookings);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, message: 'Internal server error' });
//     }
// };

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