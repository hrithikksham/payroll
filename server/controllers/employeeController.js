const Employee = require('../models/Employee');

// Add new employee
exports.addEmployee = async (req, res) => {
  try {
    const emp = new Employee(req.body);
    await emp.save();
    res.status(201).json(emp);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error while adding employee' });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}, 'name empId designation phone ');
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error while fetching employees' });
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ msg: 'Employee not found' });

    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error while updating employee' });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const removed = await Employee.findByIdAndDelete(req.params.id);

    if (!removed)
      return res.status(404).json({ msg: 'Employee not found' });

    res.json({ msg: 'Employee deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error while deleting employee' });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ msg: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching employee' });
  }
};