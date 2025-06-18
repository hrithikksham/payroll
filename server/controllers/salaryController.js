const { roundedRect } = require('pdfkit');
const Salary = require('../models/Salary');
const generatePayslipStream = require('../utils/generatePayslip');

// Create salary entry
exports.calculateSalary = async (req, res) => {
  try {
    const { employeeId, month, earnings, deductions } = req.body;

    // Prevent duplicate entries
    const exists = await Salary.findOne({ employeeId, month });
    if (exists) {
      return res.status(400).json({ msg: 'Salary already exists for this employee and month' });
    }

    const gross = Object.values(earnings).reduce((acc, val) => acc + Number(val), 0);
    const totalDeductions = Object.values(deductions).reduce((acc, val) => acc + Number(val), 0);
    const net = gross - totalDeductions;

    const salary = new Salary({
      empId,
      month,
      earnings,
      deductions,
      gross,
      net
    });

    await salary.save();
    res.status(201).json(salary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error calculating salary' });
  }
};

// Get all salaries
exports.getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find().populate('employeeId', 'name empId designation');
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch salaries' });
  }
};

// Get salaries for a specific month
exports.getSalariesByMonth = async (req, res) => {
  try {
    const { month } = req.params;
    console.log("Fetching for month:", month);

    const salaries = await Salary.find({
      month: { $regex: new RegExp(`^${month.trim()}$`, 'i') }
    }).populate('employeeId', 'name empId designation');

    if (!salaries.length) {
      return res.status(404).json({ msg: `No salaries found for ${month}` });
    }

    res.json(salaries);
  } catch (err) {
    console.error('Fetch monthly salary error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Download payslip as PDF
exports.downloadPayslip = async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await Salary.findById(id).populate('employeeId');

    if (!salary) {
      return res.status(404).json({ msg: 'Salary not found' });
    }

    generatePayslipStream(salary, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error generating payslip' });
  }
};




