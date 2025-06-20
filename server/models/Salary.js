const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  month: {
    type: String,
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
  employeeSnapshot: {
    empId: { type: String, required: true },
    name: { type: String, required: true },
    designation: { type: String, required: true },
  }
}, { timestamps: true });

module.exports = mongoose.model('Salary', salarySchema);