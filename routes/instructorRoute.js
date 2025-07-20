const express = require('express');
const {
    getAllStudents,
    addNewStudent,
    getStudentProfile,
    updateStudentProfile,
} = require('../controllers/InstructorsController');

const {
    saveNewLessonDetails,
    getAllLessons,
    getAllStudentLessons,
    updateLesson
} = require('../controllers/lessonController');

const {
    generateInstructorDiary,
    generateDiaryForStudent,
    exportStudentLessonsData
} = require('../controllers/reportController');

const { authenticateUser, authorizeRoles } = require('../middleware/authMddleware'); // Middleware for authentication

const router = express.Router();

// Authentication Middleware (Ensures only logged-in users can access)
router.use(authenticateUser);
router.use(authorizeRoles(['admin-instructor','instructor']));

// Student Management Routes
router.get('/students',getAllStudents);
router.post('/students', addNewStudent);
router.get('/students/:studentId', getStudentProfile);
router.put('/students/:studentId', updateStudentProfile);

// Lesson Management Routes
router.post('/lessons', saveNewLessonDetails);
router.get('/lessons', getAllLessons);
router.get('/lessons/:studentId', getAllStudentLessons);
router.put('/lessons/:lessonId', updateLesson);

// Report Generation Routes
router.get('/reports/instructor-diary', generateInstructorDiary);
router.get('/reports/student-diary/:studentId', generateDiaryForStudent);
router.get('/reports/export-student/:studentId', exportStudentLessonsData);

module.exports = router;
