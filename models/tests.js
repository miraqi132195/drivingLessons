const mongoose = require('mongoose');
const buffer = require("node:buffer");

const tests = new mongoose.Schema({
    startTime: { type: Date, required: false },
    endTime: { type: Date, required: false },
    status: { type: String, enum: ['pass', 'fail'] },
    type: { type: String, enum: ['insideTest', 'mainTest'] },
    // planId: { type: mongoose.Schema.Types.ObjectId, ref: 'paymentPlan', required: true },
    noteForTheTest: { type: String, default: '' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'DrivingSchool', required: true },
    route: { type: [], required: false },
    city: { type: String, required: false },

}, { timestamps: true });

module.exports = mongoose.model('Lesson', tests);
