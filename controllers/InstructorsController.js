const Student = require('../models/students');
const Instructor = require('../models/instructors');
const errorMessages = require('../types/errors').errorMessages
const successMessages = require('../types/errors').successMessages

exports.getAllStudents = async (req, res) => {
    try {
        // Get instructor's school ID
        const instructor = await Instructor.findOne({ userId: req.user._id });
        if (!instructor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Instructor not found' 
            });
        }

        // Get all students from the instructor's school
        const students = await Student.find({ schoolId: instructor.schoolId });
        return res.status(200).json({ 
            success: true, 
            message: 'Students retrieved successfully',
            data: students 
        });
    } catch (error) {
        console.error('Error getting students:', error);
        res.status(500).json({ 
            success: false, 
            message: errorMessages.getAllStudentsError, 
            error: error.message 
        });
    }
};

exports.addNewStudent = async (req, res) => {
    try {
        const { studentFullName, phoneNumber } = req.body;

        // Validate required fields
        if (!studentFullName || !phoneNumber) {
            return res.status(400).json({ 
                success: false, 
                message: 'Student full name and phone number are required' 
            });
        }

        // Check if user has proper role
        if (!req.user.role.includes('instructor') && !req.user.role.includes('admin-instructor')) {
            return res.status(403).json({ 
                success: false, 
                message: errorMessages.Unauthorized 
            });
        }

        // Get instructor's school ID
        const instructor = await Instructor.findOne({ userId: req.user._id });
        if (!instructor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Instructor not found' 
            });
        }

        // Check if student with this phone number already exists
        const existingStudent = await Student.findOne({ phoneNumber });
        if (existingStudent) {
            return res.status(400).json({ 
                success: false, 
                message: 'Student with this phone number already exists' 
            });
        }

        const newStudent = new Student({
            studentFullName,
            phoneNumber,
            schoolId: instructor.schoolId,
            lessonsNumber: 0,
            studentStatus: 'active'
        });

        const student = await newStudent.save();

        return res.status(201).json({ 
            success: true, 
            message: successMessages.studentAdded, 
            data: student 
        });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error adding student', 
            error: error.message 
        });
    }
};

exports.getStudentProfile = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Get instructor's school ID
        const instructor = await Instructor.findOne({ userId: req.user._id });
        if (!instructor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Instructor not found' 
            });
        }

        // Get student and verify they belong to the instructor's school
        const student = await Student.findOne({ 
            _id: studentId, 
            schoolId: instructor.schoolId 
        });

        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: errorMessages.studentDoesntExists 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Student profile retrieved successfully',
            data: student 
        });
    } catch (error) {
        console.error('Error getting student profile:', error);
        res.status(500).json({ 
            success: false, 
            message: errorMessages.studentDoesntExists, 
            error: error.message 
        });
    }
};

exports.updateStudentProfile = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { studentFullName, phoneNumber, studentStatus } = req.body;

        // Get instructor's school ID
        const instructor = await Instructor.findOne({ userId: req.user._id });
        if (!instructor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Instructor not found' 
            });
        }

        // Check if phone number is being updated and if it's already taken
        if (phoneNumber) {
            const existingStudent = await Student.findOne({ 
                phoneNumber, 
                _id: { $ne: studentId } 
            });
            if (existingStudent) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Phone number already exists' 
                });
            }
        }

        // Update student and verify they belong to the instructor's school
        const updatedStudent = await Student.findOneAndUpdate(
            { 
                _id: studentId, 
                schoolId: instructor.schoolId 
            },
            { 
                studentFullName, 
                phoneNumber, 
                studentStatus 
            },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ 
                success: false, 
                message: errorMessages.studentDoesntExists 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: successMessages.studentAddedUpdated, 
            data: updatedStudent 
        });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ 
            success: false, 
            message: errorMessages.errorUpdatingStudent, 
            error: error.message 
        });
    }
};
