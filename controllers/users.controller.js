const User = require("../models/userModel");

// module.exports.createUser = async (req, res, next) => {
//     try {
//         const userData = req.body;

//         // Check if a user with the same email already exists
//         const existingUser = await User.findOne({ email: userData.email });

//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Create a new user instance using the Mongoose model
//         const user = new User(userData);

//         // Save the user to the database
//         const result = await user.save();

//         // Respond with the result
//         res.status(201).json(result);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, message: 'Internal server error' });
//     }
// }
module.exports.createUser = async (req, res, next) => {
    try {
        const userData = req.body;

        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email: userData.email });

        if (existingUser) {
            // Link the Google account to the existing user account here if needed
            // You can update the existing user's profile with Google information

            // For example, you can update the existing user's name and image
            existingUser.name = userData.name;
            existingUser.image = userData.image;

            // Save the updated user profile
            const updatedUser = await existingUser.save();

            // Respond with the updated user data
            return res.status(200).json(updatedUser);
        }

        // If no existing user is found, create a new user
        const user = new User(userData);

        // Save the new user to the database
        const result = await user.save();

        // Respond with the result
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(error);
    }
}

//         // Handle specific Mongoose validation errors
//         if (error.name === 'ValidationError') {
//             return res.status(400).json({ message: error.message });
//         }

//         res.status(500).json({ error: true, message: 'Internal server error' });
//     }
// }

module.exports.getUsers = async (req, res, next) => {
    try {
        // Use Mongoose to query the database for all users
        const users = await User.find();

        // Respond with the list of users
        res.status(200).json(users);
    } catch (err) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err)
    }
}

module.exports.checkAdminStatus = async (req, res, next) => {
    try {
        const userEmail = req.params.email;

        // Check if the decoded email matches the requested email
        if (req.decoded.email !== userEmail) {
            return res.status(200).json({ admin: false });
        }

        // Use Mongoose to query the database for the user with the requested email
        const user = await User.findOne({ email: userEmail });

        // Check if the user has an 'admin' role and respond accordingly
        const isAdmin = user?.role === 'admin';
        const result = { admin: isAdmin };
        res.status(200).json(result);
    } catch (err) {
        // console.error(error);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err)
    }
};

module.exports.updateUserRole = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const updatedRole = 'admin'; // The role you want to set

        // Use Mongoose to update the user's role
        const user = await User.findByIdAndUpdate(userId, { role: updatedRole }, { new: true });

        if (!user) {
            // User not found
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        // Respond with the updated user
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err);
    }
}

module.exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        // Use Mongoose to find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            // User not found
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        if (user.role === 'admin') {
            // You can't delete an admin user
            // return res.status(403).json({ error: true, message: "You can't delete an admin user" });
            return res.send({ "error": "You Can't Delete an Admin" })
        }

        // Use Mongoose to delete the user
        await User.findByIdAndRemove(userId);

        // Respond with a success message
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err);
    }
};