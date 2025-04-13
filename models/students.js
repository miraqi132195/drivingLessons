const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentFullName: { type: String, required: true },
    phoneNumber: { type: String, unique: true, required: true },
    balance: { type: Number, default: 0 },
    lessonsNumber: { type: Number, default: 0 }, // Number of lessons taken
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true } ,// Assigned Instructor
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'DrivingSchool', default: null }, // Nullable if independent
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
