const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

// Utility function to generate a JWT token
const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

module.exports = {
    // Sign Up
    signUp : async (req, res) => {
        const { firstName, lastName, password, role, phoneNumber } = req.body;

        try {
            // Check if the phone number already exists
            const existingUser = await User.findOne({ phoneNumber });
            if (existingUser) {
                return res.status(400).json({ message: 'Phone number already exists' });
            }

            // Create new user
            const newUser = new User({
                firstName,
                lastName,
                password,
                role,
                phoneNumber
            });

            // Save the user to the database
            await newUser.save();

            // Return success response
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Sign In
    signIn: async (req, res) => {
        try {
            const { phoneNumber, password } = req.body;

            // Find user by phone number
            const user = await User.findOne({ phoneNumber });
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).send({ error: "Invalid credentials" });
            }

            // Generate JWT token
            const token = generateToken(user._id, user.role);

            res.status(200).send({
                message: "Login successful",
                token,
                userId: user._id,
                role: user.role,
            });
        } catch (error) {
            console.error("Error during sign in:", error);
            res.status(500).send({ error: "Failed to log in" });
        }
    },

    // Forget Password
    forgetPassword: async (req, res) => {
    },

    // Reset Password
    resetPassword: async (req, res) => {
    },
};
