const mongoose = require('mongoose');

const drivingSchoolSchema = new mongoose.Schema({
    schoolName: { type: String, required: true },
    schoolAddress: { type: String, required: true },
    instructorNumber: { type: Number, default: 0 }, // Number of instructors in the school
    studentsNumber: { type: Number, default: 0 }, // Number of students in the school
    carsNumber: { type: Number, default: 0 }, // Number of instructors in the school
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // The admin-instructor of the school
    active:{type: Boolean, default: true},


}, { timestamps: true });

module.exports = mongoose.model('DrivingSchool', drivingSchoolSchema);
