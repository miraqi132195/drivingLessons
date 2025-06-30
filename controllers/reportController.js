const Lesson = require('../models/lessonDiary');
const Student = require('../models/students');
const Instructor = require('../models/instructors');
const errorMessages = require('../types/errors').errorMessages;
const successMessages = require('../types/errors').successMessages;

module.exports = {
    generateInstructorDiary: async function (req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            
            // Get instructor's ID
            const instructor = await Instructor.findOne({ userId: req.user._id });
            if (!instructor) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Instructor not found' 
                });
            }

            // Build date filter
            let dateFilter = {};
            if (startDate && endDate) {
                dateFilter = {
                    startTime: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                };
            }

            // Get all lessons for this instructor with date filter
            const lessons = await Lesson.find({ 
                instructorId: instructor._id,
                ...dateFilter
            })
                .populate('studentId', 'studentFullName phoneNumber')
                .populate('schoolId', 'schoolName')
                .sort({ startTime: -1 });

            // Calculate statistics
            const totalLessons = lessons.length;
            const completedLessons = lessons.filter(lesson => lesson.status === 'completed').length;
            const scheduledLessons = lessons.filter(lesson => lesson.status === 'scheduled').length;
            const canceledLessons = lessons.filter(lesson => lesson.status === 'canceled').length;

            // Group lessons by student
            const lessonsByStudent = {};
            lessons.forEach(lesson => {
                const studentName = lesson.studentId.studentFullName;
                if (!lessonsByStudent[studentName]) {
                    lessonsByStudent[studentName] = [];
                }
                lessonsByStudent[studentName].push(lesson);
            });

            const report = {
                instructor: {
                    id: instructor._id,
                    userId: req.user._id,
                    name: `${req.user.firstName} ${req.user.lastName}`,
                    schoolId: instructor.schoolId
                },
                dateRange: {
                    startDate: startDate || 'All time',
                    endDate: endDate || 'All time'
                },
                statistics: {
                    totalLessons,
                    completedLessons,
                    scheduledLessons,
                    canceledLessons,
                    completionRate: totalLessons > 0 ? ((completedLessons / totalLessons) * 100).toFixed(2) + '%' : '0%'
                },
                lessonsByStudent,
                allLessons: lessons
            };

            res.status(200).json({
                success: true,
                message: 'Instructor diary report generated successfully',
                data: report
            });

        } catch (error) {
            console.error('Error generating instructor diary:', error);
            res.status(500).json({
                success: false,
                message: 'Error generating instructor diary',
                error: error.message
            });
        }
    },

    generateDiaryForStudent: async function (req, res, next) {
        try {
            const { studentId } = req.params;
            const { startDate, endDate } = req.query;

            // Get instructor's ID
            const instructor = await Instructor.findOne({ userId: req.user._id });
            if (!instructor) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Instructor not found' 
                });
            }

            // Check if student exists and belongs to the instructor's school
            const student = await Student.findById(studentId);
            if (!student) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Student not found' 
                });
            }

            // Build date filter
            let dateFilter = {};
            if (startDate && endDate) {
                dateFilter = {
                    startTime: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                };
            }

            // Get all lessons for this specific student
            const lessons = await Lesson.find({ 
                studentId,
                instructorId: instructor._id,
                ...dateFilter
            })
                .populate('schoolId', 'schoolName')
                .sort({ startTime: -1 });

            // Calculate student statistics
            const totalLessons = lessons.length;
            const completedLessons = lessons.filter(lesson => lesson.status === 'completed').length;
            const scheduledLessons = lessons.filter(lesson => lesson.status === 'scheduled').length;
            const canceledLessons = lessons.filter(lesson => lesson.status === 'canceled').length;

            // Calculate average lesson duration
            const completedLessonsWithDuration = lessons.filter(lesson => 
                lesson.status === 'completed' && lesson.startTime && lesson.endTime
            );
            
            let averageDuration = 0;
            if (completedLessonsWithDuration.length > 0) {
                const totalDuration = completedLessonsWithDuration.reduce((total, lesson) => {
                    return total + (new Date(lesson.endTime) - new Date(lesson.startTime));
                }, 0);
                averageDuration = Math.round(totalDuration / completedLessonsWithDuration.length / (1000 * 60)); // in minutes
            }

            const report = {
                student: {
                    id: student._id,
                    fullName: student.studentFullName,
                    phoneNumber: student.phoneNumber,
                    totalLessonsTaken: student.lessonsNumber,
                    status: student.studentStatus
                },
                instructor: {
                    id: instructor._id,
                    name: `${req.user.firstName} ${req.user.lastName}`
                },
                dateRange: {
                    startDate: startDate || 'All time',
                    endDate: endDate || 'All time'
                },
                statistics: {
                    totalLessons,
                    completedLessons,
                    scheduledLessons,
                    canceledLessons,
                    completionRate: totalLessons > 0 ? ((completedLessons / totalLessons) * 100).toFixed(2) + '%' : '0%',
                    averageLessonDuration: averageDuration + ' minutes'
                },
                lessons: lessons,
                recentLessons: lessons.slice(0, 5), // Last 5 lessons
                upcomingLessons: lessons.filter(lesson => 
                    lesson.status === 'scheduled' && new Date(lesson.startTime) > new Date()
                ).slice(0, 3) // Next 3 scheduled lessons
            };

            res.status(200).json({
                success: true,
                message: 'Student diary report generated successfully',
                data: report
            });

        } catch (error) {
            console.error('Error generating student diary:', error);
            res.status(500).json({
                success: false,
                message: 'Error generating student diary',
                error: error.message
            });
        }
    },

    exportStudentLessonsData: async function (req, res, next) {
        try {
            const { studentId } = req.params;
            const { format = 'json' } = req.query;

            // Get instructor's ID
            const instructor = await Instructor.findOne({ userId: req.user._id });
            if (!instructor) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Instructor not found' 
                });
            }

            // Check if student exists
            const student = await Student.findById(studentId);
            if (!student) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Student not found' 
                });
            }

            // Get all lessons for this student
            const lessons = await Lesson.find({ 
                studentId,
                instructorId: instructor._id
            })
                .populate('schoolId', 'schoolName')
                .sort({ startTime: -1 });

            const exportData = {
                studentInfo: {
                    id: student._id,
                    fullName: student.studentFullName,
                    phoneNumber: student.phoneNumber,
                    totalLessons: student.lessonsNumber,
                    status: student.studentStatus
                },
                instructorInfo: {
                    id: instructor._id,
                    name: `${req.user.firstName} ${req.user.lastName}`
                },
                lessons: lessons.map(lesson => ({
                    id: lesson._id,
                    startTime: lesson.startTime,
                    endTime: lesson.endTime,
                    status: lesson.status,
                    city: lesson.city,
                    route: lesson.route,
                    notes: lesson.noteForTheLesson,
                    school: lesson.schoolId.schoolName
                })),
                summary: {
                    totalLessons: lessons.length,
                    completedLessons: lessons.filter(l => l.status === 'completed').length,
                    scheduledLessons: lessons.filter(l => l.status === 'scheduled').length,
                    canceledLessons: lessons.filter(l => l.status === 'canceled').length,
                    exportDate: new Date().toISOString()
                }
            };

            if (format === 'csv') {
                // Convert to CSV format
                const csvData = this.convertToCSV(exportData);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename=student_lessons_${student.studentFullName.replace(/\s+/g, '_')}.csv`);
                return res.send(csvData);
            }

            res.status(200).json({
                success: true,
                message: 'Student lessons data exported successfully',
                data: exportData
            });

        } catch (error) {
            console.error('Error exporting student lessons data:', error);
            res.status(500).json({
                success: false,
                message: 'Error exporting student lessons data',
                error: error.message
            });
        }
    },

    convertToCSV: function(data) {
        const headers = ['Lesson ID', 'Start Time', 'End Time', 'Status', 'City', 'Notes', 'School'];
        const rows = data.lessons.map(lesson => [
            lesson.id,
            lesson.startTime,
            lesson.endTime,
            lesson.status,
            lesson.city,
            lesson.notes,
            lesson.school
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        return csvContent;
    }
}
