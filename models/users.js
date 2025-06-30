const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, unique: true, required: true },
    role: {
        type: String,
        enum: ['admin-instructor', 'instructor', 'superAdmin'],
        required: true,
    },
    active:{type: Boolean, default: true},
    password:{type: String,required: true},
    dateOfBirth:{type: String,required: true},

    paymentId:{type: String, required: true}
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
module.exports = mongoose.model('User', userSchema);
