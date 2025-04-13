const express = require('express');
const {
    addNewInstructor,
    getAllInstructors
} = require('../controllers/AdminInstructorController');

const { authenticateUser, authorizeRoles } = require('../middleware/authMddleware'); // Middleware for authentication

const router = express.Router();

// Authentication Middleware
router.use(authenticateUser);

// Restrict access to admin-instructors only
router.use(authorizeRoles(['admin-instructor']));

// Admin-Instructor Only APIs
router.post('/instructors', addNewInstructor);
router.get('/instructors', getAllInstructors);

module.exports = router;
