const mongoose = require('mongoose');
const buffer = require("node:buffer");

const cars = new mongoose.Schema({
    carNumber: { type: String, required: false },
    type: { type: String, enum: ['auto', 'manual'] },
    carSize: { type: String, enum: ['5ton', '10ton'] },
    active: { type: Boolean, default:true },

}, { timestamps: true });

module.exports = mongoose.model('Lesson', cars);
