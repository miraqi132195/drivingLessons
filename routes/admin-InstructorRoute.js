const express = require('express');
const {
    addNewInstructor,
    getAllInstructors,
    getAllStudents,
    addNewStudent,
    updateStudentProfile
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

// Student Management APIs
router.get('/students', getAllStudents);
router.post('/students', addNewStudent);
router.put('/students/:studentId', updateStudentProfile);

module.exports = router;
