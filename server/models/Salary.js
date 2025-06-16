const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  month: {
    type: String, // e.g., "June-2025"
    required: true,
  },
  earnings: {
    type: Object,
    default: {},
  },
  deductions: {
    type: Object,
    default: {},
  },
  gross: {
    type: Number,
    required: true,
  },
  net: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Salary', salarySchema);