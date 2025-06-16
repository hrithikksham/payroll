const PDFDocument = require('pdfkit');

function generatePayslipStream(salary, res) {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${salary.employeeId.name}-Payslip.pdf`);

  doc.pipe(res);

  doc.fontSize(18).text(`Payslip - ${salary.month}`, { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Name: ${salary.employeeId.name}`);
  doc.text(`Designation: ${salary.employeeId.designation}`);
  doc.text(`Month: ${salary.month}`);
  doc.moveDown();

  doc.fontSize(14).text('Earnings:');
  Object.entries(salary.earnings).forEach(([key, value]) => {
    doc.text(`${key.toUpperCase()}: ₹${value}`);
  });

  doc.moveDown();
  doc.fontSize(14).text('Deductions:');
  Object.entries(salary.deductions).forEach(([key, value]) => {
    doc.text(`${key.toUpperCase()}: ₹${value}`);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Gross: ₹${salary.gross}`);
  doc.text(`Net: ₹${salary.net}`);

  doc.end();
}

module.exports = generatePayslipStream;