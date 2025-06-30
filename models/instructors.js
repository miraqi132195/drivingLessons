const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'DrivingSchool', default: null }, // Nullable if independent
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'cars', default: null }, // Nullable if independent
    drivingLicense: { type: String, required: false },
    active:{type: Boolean, default: true},
    isTester:{type: Boolean, default: true},
    salary: { type: String, required: false },
    seniority: { type: String, required: false },


}, { timestamps: true });

module.exports = mongoose.model('Instructor', instructorSchema);
