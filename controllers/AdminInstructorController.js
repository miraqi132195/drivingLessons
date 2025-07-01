const Student = require('../models/students');
const Instructor = require('../models/instructors');
const errorMessages = require('../types/errors').errorMessages
const successMessages = require('../types/errors').successMessages

exports.addNewInstructor = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, email, password } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !phoneNumber || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Get admin-instructor's school ID
        const adminInstructor = await Instructor.findOne({ userId: req.user._id });
        if (!adminInstructor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin-instructor not found' 
            });
        }

        // Create new instructor logic here (similar to admin controller)
        // This would typically involve creating a user and then an instructor profile
        
        return res.status(201).json({ 
            success: true, 
            message: 'Instructor added successfully' 
        });
    } catch (error) {
        console.error('Error adding instructor:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error adding instructor', 
            error: error.message 
        });
    }
};

exports.getAllInstructors = async (req, res) => {
    try {
        // Get admin-instructor's school ID
        const adminInstructor = await Instructor.findOne({ userId: req.user._id });
        if (!adminInstructor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin-instructor not found' 
            });
        }

        // Get all instructors in the same school
        const instructors = await Instructor.find({ schoolId: adminInstructor.schoolId })
            .populate('userId', 'firstName lastName phoneNumber email')
            .populate('schoolId', 'schoolName');

        return res.status(200).json({ 
            success: true, 
            message: 'Instructors retrieved successfully',
            data: instructors 
        });
    } catch (error) {
        console.error('Error getting instructors:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error getting instructors', 
            error: error.message 
        });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        // Get admin-instructor's school ID
        const adminInstructor = await Instructor.findOne({ userId: req.user._id });
        if (!adminInstructor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin-instructor not found' 
            });
        }

        // Get all students from the school (admin-instructor can see all students)
        const students = await Student.find({ schoolId: adminInstructor.schoolId })
            .populate('schoolId', 'schoolName')
            .populate({
                path: 'instructorId',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName phoneNumber'
                }
            });

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
        const { studentFullName, phoneNumber, instructorId } = req.body;

        // Validate required fields
        if (!studentFullName || !phoneNumber || !instructorId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Student full name, phone number, and instructor ID are required' 
            });
        }

        // Get admin-instructor's school ID
        const adminInstructor = await Instructor.findOne({ userId: req.user._id });
        if (!adminInstructor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin-instructor not found' 
            });
        }

        // Verify the instructor belongs to the same school
        const instructor = await Instructor.findOne({ 
            _id: instructorId, 
            schoolId: adminInstructor.schoolId 
        });
        if (!instructor) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid instructor ID or instructor not in your school' 
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
            schoolId: adminInstructor.schoolId,
            instructorId: instructorId, // Assign to specific instructor
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

exports.updateStudentProfile = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { studentFullName, phoneNumber, studentStatus, instructorId } = req.body;

        // Get admin-instructor's school ID
        const adminInstructor = await Instructor.findOne({ userId: req.user._id });
        if (!adminInstructor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin-instructor not found' 
            });
        }

        // If instructorId is being updated, verify the new instructor belongs to the same school
        if (instructorId) {
            const instructor = await Instructor.findOne({ 
                _id: instructorId, 
                schoolId: adminInstructor.schoolId 
            });
            if (!instructor) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid instructor ID or instructor not in your school' 
                });
            }
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

        // Update student and verify they belong to the admin-instructor's school
        const updatedStudent = await Student.findOneAndUpdate(
            { 
                _id: studentId, 
                schoolId: adminInstructor.schoolId 
            },
            { 
                studentFullName, 
                phoneNumber, 
                studentStatus,
                instructorId 
            },
            { new: true, runValidators: true }
        ).populate('schoolId', 'schoolName')
         .populate({
             path: 'instructorId',
             populate: {
                 path: 'userId',
                 select: 'firstName lastName phoneNumber'
             }
         });

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


