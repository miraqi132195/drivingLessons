const mongoose = require('mongoose');

const payments = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
    paymentDate: {type: String, required: false}, //todo : required true - production
    paymentsStatus :{type: String, required: false},
    totalPayment :{type: String, required: false},
    firstName: { type: String, required: true },
    plan: {
        type: String,
        enum: ['3Months', '6Months', '12Months'],
        required: true,
    },
    active:{type: Boolean, default: true},
    creditInfo :{type: String, required: false},
    seatsNum:{type: Number, required: false},
    isAnalytics:{type: Boolean, default: true},
    isPaymentManagement:{type: Boolean, default: true},
    lastName: { type: String, required: true },
    phoneNumber: { type: String, unique: true, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Instructor', payments);
