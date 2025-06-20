// salaryController.js
const Salary = require('../models/Salary');
const Employee = require('../models/Employee');
const generatePayslipStream = require('../utils/generatePayslipStream');

// Create salary entry
exports.calculateSalary = async (req, res) => {
  try {
    const { employeeId, month, earnings, deductions } = req.body;

    const exists = await Salary.findOne({ employeeId, month });
    if (exists) {
      return res.status(400).json({ msg: 'Salary already exists for this employee and month' });
    }

    const gross = Object.values(earnings).reduce((acc, val) => acc + Number(val), 0);
    const totalDeductions = Object.values(deductions).reduce((acc, val) => acc + Number(val), 0);
    const net = gross - totalDeductions;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    const salary = new Salary({
      employeeId,
      month,
      earnings,
      deductions,
      gross,
      net,
      employeeSnapshot: {
        empId: employee.empId,
        name: employee.name,
        designation: employee.designation
      }
    });

    await salary.save();
    res.status(201).json(salary);
  } catch (err) {
    console.error('💥 Salary Controller Error:', err.message);
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

// Update salary entry
exports.updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, month, earnings, deductions } = req.body;

    const gross = Object.values(earnings).reduce((a, v) => a + Number(v), 0);
    const totalDeductions = Object.values(deductions).reduce((a, v) => a + Number(v), 0);
    const net = gross - totalDeductions;

    const employee = await Employee.findById(employeeId);

    const updated = await Salary.findByIdAndUpdate(
      id,
      {
        employeeId,
        month,
        earnings,
        deductions,
        gross,
        net,
        employeeSnapshot: employee
          ? {
              empId: employee.empId,
              name: employee.name,
              designation: employee.designation
            }
          : undefined
      },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error('Update Salary Error:', err.message);
    res.status(500).json({ msg: 'Error updating salary' });
  }
};

// Get salaries by month
exports.getSalariesByMonth = async (req, res) => {
  try {
    const { month } = req.params;
    const regexPattern = new RegExp(`^${month.replace('-', '[- ]')}$`, 'i');

    const salaries = await Salary.find({
      month: { $regex: regexPattern }
    });

    if (!salaries.length) {
      return res.status(404).json({ msg: `No salaries found for ${month}` });
    }

    res.json(salaries);
  } catch (err) {
    console.error('Fetch monthly salary error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get yearly report
exports.getSalariesByYear = async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const regex = new RegExp(`${year}$`, 'i');

    const salaries = await Salary.find({ month: { $regex: regex } });

    const monthlyTotals = {};

    for (let salary of salaries) {
      const [monthStr] = salary.month.split(/[- ]/);
      if (!monthlyTotals[monthStr]) monthlyTotals[monthStr] = 0;
      monthlyTotals[monthStr] += salary.net;
    }

    const totalSpend = salaries.reduce((acc, cur) => acc + cur.net, 0);

    res.json({
      totalSpendings: totalSpend,
      monthlyBreakdown: monthlyTotals,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch yearly salary data' });
  }
};

// Get available years for dropdown
exports.getAvailableYears = async (req, res) => {
  try {
    const allSalaries = await Salary.find({}, 'month');
    const years = new Set();

    allSalaries.forEach(entry => {
      const parts = entry.month.split(/[- ]/);
      const year = parts[1];
      if (year) years.add(year);
    });

    res.json(Array.from(years).sort());
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching years' });
  }
};

// Delete salary
exports.deleteSalary = async (req, res) => {
  try {
    const deleted = await Salary.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Salary not found' });
    }
    res.json({ msg: 'Salary deleted successfully' });
  } catch (err) {
    console.error('Delete Salary Error:', err.message);
    res.status(500).json({ msg: 'Server error while deleting salary' });
  }
};

// Payslip PDF
exports.downloadPayslip = async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await Salary.findById(id);

    if (!salary) {
      return res.status(404).json({ msg: 'Salary not found' });
    }

    generatePayslipStream(salary, res); // Util writes stream directly
  } catch (err) {
    console.error('Payslip Generation Error:', err.message);
    res.status(500).json({ msg: 'Error generating payslip' });
  }
};

// GET /api/salary/net/current-month
exports.getCurrentMonthNetTotal = async (req, res) => {
  try {
    const now = new Date();
    const formattedMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' }); // e.g. "June 2025"

    const regex = new RegExp(`^${formattedMonth.replace('-', '[- ]')}$`, 'i');

    const salaries = await Salary.find({ month: { $regex: regex } });

    const totalNet = salaries.reduce((sum, s) => sum + s.net, 0);

    res.json({ totalNet });
  } catch (err) {
    console.error('Get current month net salary error:', err.message);
    res.status(500).json({ msg: 'Failed to fetch current month net salary' });
  }
};