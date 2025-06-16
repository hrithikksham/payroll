const Salary = require('../models/Salary');
const Employee = require('../models/Employee');

// Salaries for a specific month (all employees)
exports.getMonthlyReport = async (req, res) => {
  try {
    const { month } = req.params;

    const data = await Salary.find({
      month: { $regex: new RegExp(`^${month.trim()}$`, 'i') }
    }).populate('employeeId', 'name empId designation');

    if (!data.length) {
      return res.status(404).json({ msg: 'No salaries found for this month' });
    }

    const totalGross = data.reduce((acc, s) => acc + s.gross, 0);
    const totalNet = data.reduce((acc, s) => acc + s.net, 0);

    res.json({
      month,
      totalEmployees: data.length,
      totalGross,
      totalNet,
      salaries: data
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error in monthly report' });
  }
};

// All salaries for a specific employee
exports.getEmployeeReport = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ msg: 'Employee not found' });

    const data = await Salary.find({ employeeId: id }).sort({ month: 1 });

    const totalGross = data.reduce((acc, s) => acc + s.gross, 0);
    const totalNet = data.reduce((acc, s) => acc + s.net, 0);

    res.json({
      employee: {
        name: employee.name,
        empId: employee.empId,
        designation: employee.designation,
      },
      totalMonths: data.length,
      totalGross,
      totalNet,
      history: data
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error in employee report' });
  }
};