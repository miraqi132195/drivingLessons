const express = require('express');
const {
    addNewDrivingSchool,
    updateDrivingSchoolInfo,
    addNewAdminInstructor,
    updateAdminInstructor
} = require('../controllers/adminController');

const { authenticateUser, authorizeRoles } = require('../middleware/authMddleware'); // Middleware for authentication

const router = express.Router();

// Authentication Middleware


router.use(authenticateUser);
router.use(authorizeRoles(['superAdmin']));

// Restrict access to admin-instructors only

// Admin-Instructor Only APIs
router.post('/newDrivingSchool' ,addNewDrivingSchool);
router.post('/newAdminInstructor', addNewAdminInstructor);
router.get('/:instructorId', updateAdminInstructor);
router.post('/:schoolId', updateDrivingSchoolInfo);

module.exports = router;
