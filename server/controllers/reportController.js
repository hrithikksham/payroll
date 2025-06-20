const Salary = require('../models/Salary');
const Employee = require('../models/Employee');
// In controllers/salaryController.js
const PDFDocument = require('pdfkit');
const getStream = require('get-stream');



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



exports.downloadMonthlyReportPDF = async (req, res) => {
  try {
    const { month } = req.params;
    const regexPattern = new RegExp(`^${month.replace('-', '[- ]')}$`, 'i');
    const salaries = await Salary.find({ month: { $regex: regexPattern } });

    if (!salaries.length) {
      return res.status(404).json({ msg: `No salary records found for ${month}` });
    }

    const doc = new PDFDocument({ margin: 50 });
    const filename = `Salary_Report_${month.replace(' ', '_')}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    // Title
    doc.fontSize(20).text(`Salary Report - ${month}`, { align: 'center' });
    doc.moveDown();

    // Table Headers
    doc.fontSize(12);
    doc.text('EMP ID', 50);
    doc.text('Name', 120);
    doc.text('Designation', 250);
    doc.text('Net Salary', 400);
    doc.moveDown();

    // Table Rows
    salaries.forEach(s => {
      const snap = s.employeeSnapshot || {};
      doc.text(snap.empId || '-', 50);
      doc.text(snap.name || '-', 120);
      doc.text(snap.designation || '-', 250);
      doc.text(`Rs. ${s.net.toFixed(2)}`, 400);
      doc.moveDown();
    });

    doc.end();
    doc.pipe(res); // ✅ Stream to response
  } catch (err) {
    console.error('PDF Report Error:', err.message);
    res.status(500).json({ msg: 'Failed to generate report PDF' });
  }
};