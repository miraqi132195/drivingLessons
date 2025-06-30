const mongoose = require('mongoose');
const buffer = require("node:buffer");

const lessonSchema = new mongoose.Schema({
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'canceled'], default: 'scheduled' },
    noteForTheLesson: { type: String, default: '' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'DrivingSchool', required: true },
    route: { type: [], required: false },
    city: { type: String, required: true },

}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
