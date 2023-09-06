const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensures email addresses are unique
        },
        role: {
            type: String,
            enum: ['admin', 'user'], // You can adjust the enum values as needed
            default: 'user', // Default role is 'user' if not provided
        },
        image: {
            type: String, // Assuming you store image URLs as strings
            // You can add more validation for image URLs if needed
        },
    },
    {
        timestamps: true, // Enable timestamps
    },
    {
        collection: 'users'
    }
);

// Create the User model
const User = mongoose.model('users', userSchema);

module.exports = User;