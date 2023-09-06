const User = require('../models/userModel'); // Import your User model

const verifyAdmin = async (req, res, next) => {
    try {
        const email = req.decoded.email;

        // Use Mongoose to find the user by email
        const user = await User.findOne({ email });

        // Check if the user exists and has an 'admin' role
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: true, message: 'Forbidden access' });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error' });
    }
};

module.exports = verifyAdmin;