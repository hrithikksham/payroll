const Salary = require('../models/Salary');
const Employee = require('../models/Employee');
const PDFDocument = require('pdfkit');

// 📊 Get salaries for a specific month
exports.getMonthlyReport = async (req, res) => {
  try {
    const { month } = req.params;

    const salaries = await Salary.find({
      month: { $regex: new RegExp(`^${month.trim().replace('-', '[- ]')}$`, 'i') }
    });

    if (!salaries.length) {
      return res.status(404).json({ msg: 'No salaries found for this month' });
    }

    const totalGross = salaries.reduce((acc, s) => acc + s.gross, 0);
    const totalNet = salaries.reduce((acc, s) => acc + s.net, 0);

    res.json({
      month,
      totalEmployees: salaries.length,
      totalGross,
      totalNet,
      salaries
    });
  } catch (err) {
    console.error('❌ getMonthlyReport Error:', err.message);
    res.status(500).json({ msg: 'Server error in monthly report' });
  }
};

// 📄 Download monthly PDF report
exports.downloadMonthlyReportPDF = async (req, res) => {
  try {
    console.log('📥 PDF Request received:', {
      originalUrl: req.originalUrl,
      params: req.params,
      rawMonth: req.params.month
    });

    const encoded = req.params.month;
    if (!encoded) {
      console.error('❌ No month parameter provided');
      return res.status(400).json({ msg: 'Month parameter is required' });
    }

    const decodedMonth = decodeURIComponent(encoded);
    console.log('🔍 Decoded month:', decodedMonth);

    // More flexible month matching - handle different formats
    const monthRegex = new RegExp(decodedMonth.replace(/[-\s]/g, '[-\\s]'), 'i');
    console.log('🔍 Using regex:', monthRegex);

    const salaries = await Salary.find({
      month: { $regex: monthRegex }
    });

    console.log(`📊 Found ${salaries.length} salary records for month: ${decodedMonth}`);

    if (!salaries.length) {
      // Log available months for debugging
      const availableMonths = await Salary.distinct('month');
      console.log('📅 Available months in database:', availableMonths);
      
      return res.status(404).json({ 
        msg: 'No data found for this month',
        requestedMonth: decodedMonth,
        availableMonths: availableMonths
      });
    }

    const doc = new PDFDocument({ margin: 50 });
    
    // Set headers before piping
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Salary_Report_${decodedMonth.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);
    
    // Important: Handle errors on the doc stream
    doc.on('error', (err) => {
      console.error('❌ PDF Document error:', err);
      if (!res.headersSent) {
        res.status(500).json({ msg: 'Error generating PDF document' });
      }
    });

    doc.pipe(res);

    // Header
    doc.fontSize(22).text(`Salary Report`, { align: 'center' });
    doc.moveDown().fontSize(14).text(`Month: ${decodedMonth}`, { align: 'center' });
    doc.moveDown(2);

    // Add summary
    const totalAmount = salaries.reduce((sum, entry) => sum + (entry.net || 0), 0);
    doc.fontSize(12).text(`Total Employees: ${salaries.length}`, { align: 'left' });
    doc.text(`Total Amount: ₹${totalAmount.toFixed(2)}`, { align: 'left' });
    doc.moveDown();

    // Table header
    doc.fontSize(12).text('S.No. | Name | Emp ID | Designation | Net Salary', { 
      underline: true,
      paragraphGap: 5 
    });
    doc.moveDown();

    // Table data
    salaries.forEach((entry, index) => {
      const snap = entry.employeeSnapshot || {};
      const name = snap.name || 'Unknown';
      const empId = snap.empId || 'N/A';
      const designation = snap.designation || 'N/A';
      const netSalary = entry.net ? entry.net.toFixed(2) : '0.00';
      
      doc.fontSize(10).text(
        `${index + 1}. ${name} | ${empId} | ${designation} | ₹${netSalary}`,
        { paragraphGap: 3 }
      );
    });

    doc.end();
    console.log('✅ PDF generated successfully');

  } catch (err) {
    console.error('❌ PDF generation error:', err);
    
    // Make sure we don't send headers twice
    if (!res.headersSent) {
      res.status(500).json({ 
        msg: 'Error generating PDF',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  }
};

// 🧾 Get full report for a specific employee
exports.getEmployeeReport = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ msg: 'Employee not found' });

    const history = await Salary.find({ employeeId: id }).sort({ month: 1 });

    const totalGross = history.reduce((acc, s) => acc + s.gross, 0);
    const totalNet = history.reduce((acc, s) => acc + s.net, 0);

    res.json({
      employee: {
        name: employee.name,
        empId: employee.empId,
        designation: employee.designation
      },
      totalMonths: history.length,
      totalGross,
      totalNet,
      history
    });
  } catch (err) {
    console.error('❌ getEmployeeReport Error:', err.message);
    res.status(500).json({ msg: 'Server error in employee report' });
  }
};