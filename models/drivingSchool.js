const mongoose = require('mongoose');

const drivingSchoolSchema = new mongoose.Schema({
    schoolName: { type: String, required: true },
    schoolAddress: { type: String, required: true },
    instructorNumber: { type: Number, default: 0 }, // Number of instructors in the school
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // The admin-instructor of the school
}, { timestamps: true });

module.exports = mongoose.model('DrivingSchool', drivingSchoolSchema);
