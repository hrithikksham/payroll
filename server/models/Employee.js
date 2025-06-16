const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  baseSalary: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);