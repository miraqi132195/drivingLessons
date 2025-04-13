const express = require('express');
const {
    getAllStudents,
    addNewStudent,
    getStudentProfile,
    updateStudentProfile,
    // getLessonsDiary,
    // saveLesson,
    // updateLesson
} = require('../controllers/InstructorsController');

const { authenticateUser, authorizeRoles } = require('../middleware/authMddleware'); // Middleware for authentication

const router = express.Router();

// Authentication Middleware (Ensures only logged-in users can access)
router.use(authenticateUser);
router.use(authorizeRoles(['admin-instructor','instructor']));

// Instructor & Admin-Instructor can access these
router.get('/students', getAllStudents);
router.post('/students', addNewStudent);
router.get('/students/:studentId', getStudentProfile);
router.put('/students/:studentId', updateStudentProfile);

// Lessons Management (Shared)
// router.post('/lesson', saveLesson);
// router.put('/lesson/:lessonId', updateLesson);
// router.get('/diary/:instructorId', getLessonsDiary);

module.exports = router;
