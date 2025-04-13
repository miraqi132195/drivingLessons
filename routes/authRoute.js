const express = require('express');
const {
    signUp,
    signIn,
    forgetPassword,
    resetPassword,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMddleware');

const router = express.Router();

// CRUD Routes
router.post('/signUp', signUp); //signUp
router.post('/signIn', signIn); // signIn
// router.get('/:id', authMiddleware, forgetPassword); // forgetPassword
// router.put('/:id', authMiddleware, resetPassword); // resetPassword

module.exports = router;
