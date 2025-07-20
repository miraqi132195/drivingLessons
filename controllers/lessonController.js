// controllers/lessonController.js
const uuid = require("uuid");
const Lesson = require('../models/lessonDiary');
const Student = require('../models/students');
const Instructor = require('../models/instructors');
const errorMessages = require('../types/errors').errorMessages;
const successMessages = require('../types/errors').successMessages;

module.exports = {
    saveNewLessonDetails: async function (req, res, next) {
        try {
            const { 
                studentId, 
                startTime, 
                endTime, 
                noteForTheLesson, 
                route, 
                city,
                status = 'scheduled'
            } = req.body;

            // Validate required fields
            if (!studentId || !startTime || !endTime || !city) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Missing required fields: studentId, startTime, endTime, city' 
                });
            }

            // Get instructor's ID
            const instructor = await Instructor.findOne({ userId: req.user._id });
            if (!instructor) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Instructor not found' 
                });
            }

            // Check if student exists and belongs to this specific instructor
            const student = await Student.findOne({ 
                _id: studentId, 
                instructorId: instructor._id 
            });
            if (!student) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Student not found or not assigned to you' 
                });
            }

            // Create new lesson
            const newLesson = new Lesson({
                studentId,
                instructorId: instructor._id,
                schoolId: instructor.schoolId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                status,
                noteForTheLesson: noteForTheLesson || '',
                route: route || [],
                city
            });

            await newLesson.save();

            // Update student's lesson count
            student.lessonsNumber += 1;
            await student.save();

            res.status(201).json({
                success: true,
                message: 'Lesson saved successfully',
                data: newLesson
            });

        } catch (error) {
            console.error('Error saving lesson:', error);
            res.status(500).json({
                success: false,
                message: 'Error saving lesson',
                error: error.message
            });
        }
    },

    getAllLessons: async function (req, res, next) {
        try {
            // Get instructor's ID
            const instructor = await Instructor.findOne({ userId: req.user._id });
            if (!instructor) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Instructor not found' 
                });
            }

            // Get all lessons for this instructor
            const lessons = await Lesson.find({ instructorId: instructor._id })
                .populate('studentId', 'studentFullName phoneNumber')
                .populate('schoolId', 'schoolName')
                .sort({ startTime: -1 });

            res.status(200).json({
                success: true,
                message: 'Lessons retrieved successfully',
                data: lessons
            });

        } catch (error) {
            console.error('Error getting lessons:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving lessons',
                error: error.message
            });
        }
    },
    getAllStudentLessons: async function (req, res, next) {
        try {
            // Get instructor's ID
            // const instructor = await Instructor.findOne({ userId: req.user._id });
            // if (!instructor) {
            //     return res.status(404).json({
            //         success: false,
            //         message: 'Instructor not found'
            //     });
            // }

            // Get all lessons for this instructor
            const lessons = await Lesson.find({ studentId: req.params.studentId ,  })
                .populate('studentId', 'studentFullName phoneNumber')
                // .populate('schoolId', 'schoolName')
                .sort({ startTime: -1 });

            res.status(200).json({
                success: true,
                message: 'Lessons retrieved successfully',
                data: lessons
            });

        } catch (error) {
            console.error('Error getting lessons:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving lessons',
                error: error.message
            });
        }
    },

    updateLesson: async function (req, res, next) {
        try {
            const { lessonId } = req.params;
            const updateData = req.body;

            // Get instructor's ID
            const instructor = await Instructor.findOne({ userId: req.user._id });
            if (!instructor) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Instructor not found' 
                });
            }

            // Find and update lesson
            const lesson = await Lesson.findOneAndUpdate(
                { _id: lessonId, instructorId: instructor._id },
                updateData,
                { new: true, runValidators: true }
            ).populate('studentId', 'studentFullName phoneNumber');

            if (!lesson) {
                return res.status(404).json({
                    success: false,
                    message: 'Lesson not found or access denied'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Lesson updated successfully',
                data: lesson
            });

        } catch (error) {
            console.error('Error updating lesson:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating lesson',
                error: error.message
            });
        }
    }
}
