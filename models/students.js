const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentFullName: { type: String, required: true },
    phoneNumber: { type: String, unique: true, required: true },
    // paymentPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'schoolPaymentPlan', default: null },
    lessonsNumber: { type: Number, default: 0 }, // Number of lessons taken
    studentStatus: { type: String, default: 'active' }, // Student status (active, inactive, graduated, etc.)
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'DrivingSchool', required: true }, // School the student belongs to
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true }, // Specific instructor assigned to this student
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
