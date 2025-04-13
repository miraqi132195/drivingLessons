const Student = require('../models/students');
const Instructor = require('../models/instructors');
const errorMessages = require('../types/errors').errorMessages
const successMessages = require('../types/errors').successMessages


exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({ instructorId: req.user._id });
        return res.status(200).json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: errorMessages.getAllStudentsError, error });
    }
};
exports.addNewStudent = async (req, res) => {
    try {
        const { studentFullName, phoneNumber, balance, lessonsNumber } = req.body;

        if (!req.user.role.includes('instructor') && !req.user.role.includes('admin-instructor')) {
            return res.status(403).json({ success: false, message: errorMessages.Unauthorized });
        }
        const newStudent = {
            studentFullName,
            phoneNumber,
            balance,
            lessonsNumber,
            instructorId: req.user._id, // Instructor who is adding the student
        }
        const student = await Student.create(newStudent);

        return res.status(201).json({ success: true, message: successMessages.studentAdded, data: newStudent });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding student', error });
    }
};

exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);

        if (!student) return res.status(404).json({ success: false, message: errorMessages.studentDoesntExists });

        return res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: errorMessages.studentDoesntExists, error });
    }
};

exports.updateStudentProfile = async (req, res) => {
    try {
        const { studentFullName, phoneNumber, balance } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.studentId,
            { studentFullName, phoneNumber, balance },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) return res.status(404).json({ success: false, message: errorMessages.studentDoesntExists });

        return res.status(200).json({ success: true, message: successMessages.studentAddedUpdated, data: updatedStudent });
    } catch (error) {
        res.status(500).json({ success: false, message: errorMessages.errorUpdatingStudent, error });
    }
};
