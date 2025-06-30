const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentFullName: { type: String, required: true },
    phoneNumber: { type: String, unique: true, required: true },
    // paymentPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'schoolPaymentPlan', default: null },
    lessonsNumber: { type: Number, default: 0 }, // Number of lessons taken
    studentStatus: { type: String, default: 0 }, // Number of lessons taken
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'DrivingSchool', default: null }, // Nullable if independent
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
