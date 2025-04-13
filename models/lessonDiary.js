const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    lessonId: { type: String, unique: true, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'canceled'], default: 'scheduled' },
    noteForTheLesson: { type: String, default: '' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
