const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

class PayslipGenerator {
  constructor() {
    this.doc = null;
    this.pageWidth = 595; // A4 width in points
    this.pageHeight = 842; // A4 height in points
    this.margin = 40;
    this.contentWidth = this.pageWidth - (this.margin * 2);
    
    // Color scheme
    this.colors = {
      primary: '#2c3e50',
      secondary: '#34495e',
      accent: '#3498db',
      light: '#ecf0f1',
      border: '#bdc3c7',
      text: '#2c3e50'
    };
    
    // Font sizes
    this.fonts = {
      title: 20,
      subtitle: 14,
      header: 12,
      body: 10,
      small: 8
    };
  }

  generatePayslipStream(salary, res) {
    this.doc = new PDFDocument({ 
      margin: this.margin,
      size: 'A4'
    });
    
    const emp = salary.employeeSnapshot;

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=payslip.pdf');
    this.doc.pipe(res);

    // Generate document sections
    this.renderHeader();
    this.renderTitle();
    this.renderEmployeeInfo(emp, salary);
    this.renderSalaryBreakdown(salary);
    this.renderFooter();

    this.doc.end();
  }

  // === HEADER SECTION ===
  renderHeader() {
    const logoPath = path.join(__dirname, '../assets/anjo.png');
    let logoX = this.margin;
    let textX = logoX + 90;
    
    // Company logo
    if (fs.existsSync(logoPath)) {
      this.doc.image(logoPath, logoX, this.margin, { width: 70 });
    }

    // Company header with styled background
    this.doc
      .rect(textX, this.margin, this.contentWidth - 90, 60)
      .fillAndStroke(this.colors.light, this.colors.border);

    // Company name and details
    this.doc
      .fillColor(this.colors.primary)
      .fontSize(this.fonts.title)
      .font('Helvetica-Bold')
      .text('Anjo Aqua World', textX + 10, this.margin + 8);

    this.doc
      .fillColor(this.colors.text)
      .fontSize(this.fonts.body)
      .font('Helvetica')
      .text('219/40 Kamaraj Road, Kumbakonam-612001', textX + 10, this.margin + 32)
      .text('Phone: 81 44 22 77 22', textX + 10, this.margin + 45);

    // Header separator line
    this.doc
      .strokeColor(this.colors.primary)
      .lineWidth(2)
      .moveTo(this.margin, this.margin + 70)
      .lineTo(this.pageWidth - this.margin, this.margin + 70)
      .stroke();
  }

  // === TITLE SECTION ===
  renderTitle() {
    const titleY = this.margin + 90;
    
    // Title background
    this.doc
      .rect(this.margin, titleY, this.contentWidth, 30)
      .fillAndStroke(this.colors.primary, this.colors.primary);

    // Title text
    this.doc
      .fillColor('white')
      .fontSize(this.fonts.subtitle)
      .font('Helvetica-Bold')
      .text('PAYSLIP', this.margin, titleY + 8, {
        align: 'center',
        width: this.contentWidth
      });
  }

  // === EMPLOYEE INFO SECTION ===
  renderEmployeeInfo(emp, salary) {
    const startY = this.margin + 140;
    const tableHeight = 80;
    
    // Employee info table background
    this.doc
      .rect(this.margin, startY, this.contentWidth, tableHeight)
      .fillAndStroke('white', this.colors.border);

    // Table header
    this.doc
      .rect(this.margin, startY, this.contentWidth, 20)
      .fillAndStroke(this.colors.secondary, this.colors.border);

    this.doc
      .fillColor('white')
      .fontSize(this.fonts.header)
      .font('Helvetica-Bold')
      .text('Employee Information', this.margin + 10, startY + 6);

    // Employee details with proper alignment
    const infoY = startY + 30;
    const leftCol = this.margin + 15;
    const rightCol = this.margin + (this.contentWidth / 2) + 15;
    const rowHeight = 15;

    this.renderInfoRow('Employee Name:', emp?.name || 'N/A', leftCol, infoY, rightCol);
    this.renderInfoRow('Employee ID:', emp?.empId || 'N/A', leftCol, infoY + rowHeight, rightCol);
    this.renderInfoRow('Designation:', emp?.designation || 'N/A', leftCol, infoY + (rowHeight * 2), rightCol);
    this.renderInfoRow('Pay Period:', salary.month || 'N/A', leftCol, infoY + (rowHeight * 3), rightCol);

    // Vertical separator line
    this.doc
      .strokeColor(this.colors.border)
      .lineWidth(1)
      .moveTo(this.margin + (this.contentWidth / 2), startY + 20)
      .lineTo(this.margin + (this.contentWidth / 2), startY + tableHeight)
      .stroke();
  }

  renderInfoRow(label, value, leftX, y, rightX) {
    this.doc
      .fillColor(this.colors.text)
      .fontSize(this.fonts.body)
      .font('Helvetica-Bold')
      .text(label, leftX, y)
      .font('Helvetica')
      .text(value, leftX + 90, y);
  }

  // === SALARY BREAKDOWN SECTION ===
  renderSalaryBreakdown(salary) {
    const startY = this.margin + 240;
    const tableWidth = (this.contentWidth - 20) / 2;
    const earningsX = this.margin;
    const deductionsX = this.margin + tableWidth + 20;

    // Render earnings table
    this.renderSalaryTable('EARNINGS', salary.earnings, earningsX, startY, tableWidth);
    
    // Render deductions table
    this.renderSalaryTable('DEDUCTIONS', salary.deductions, deductionsX, startY, tableWidth);

    // Calculate table heights to align summary
    const maxRows = Math.max(
      Object.keys(salary.earnings).length,
      Object.keys(salary.deductions).length
    );
    const tableHeight = 25 + (maxRows * 18) + 5; // header + rows + padding

    // Render summary section
    this.renderSummary(salary, startY + tableHeight + 10);
  }

  renderSalaryTable(title, data, x, y, width) {
    const headerHeight = 25;
    const rowHeight = 18;
    const dataEntries = Object.entries(data);
    const tableHeight = headerHeight + (dataEntries.length * rowHeight) + 5;

    // Table border
    this.doc
      .rect(x, y, width, tableHeight)
      .fillAndStroke('white', this.colors.border);

    // Table header
    this.doc
      .rect(x, y, width, headerHeight)
      .fillAndStroke(this.colors.accent, this.colors.accent);

    this.doc
      .fillColor('white')
      .fontSize(this.fonts.header)
      .font('Helvetica-Bold')
      .text(title, x + 10, y + 7);

    // Table rows
    dataEntries.forEach(([key, value], index) => {
      const rowY = y + headerHeight + (index * rowHeight);
      
      // Alternate row colors
      if (index % 2 === 0) {
        this.doc
          .rect(x, rowY, width, rowHeight)
          .fillAndStroke(this.colors.light, this.colors.light);
      }

      // Row separator line
      this.doc
        .strokeColor(this.colors.border)
        .lineWidth(0.5)
        .moveTo(x, rowY)
        .lineTo(x + width, rowY)
        .stroke();

      // Row content
      this.doc
        .fillColor(this.colors.text)
        .fontSize(this.fonts.body)
        .font('Helvetica')
        .text(this.formatKey(key), x + 10, rowY + 4)
        .font('Helvetica-Bold')
        .text(`₹${value.toFixed(2)}`, x + width - 80, rowY + 4, {
          align: 'right',
          width: 70
        });
    });
  }

  renderSummary(salary, startY) {
    const summaryHeight = 60;
    const totalDeductions = Object.values(salary.deductions).reduce((a, b) => a + b, 0);

    // Summary background
    this.doc
      .rect(this.margin, startY, this.contentWidth, summaryHeight)
      .fillAndStroke(this.colors.light, this.colors.border);

    // Summary header
    this.doc
      .rect(this.margin, startY, this.contentWidth, 20)
      .fillAndStroke(this.colors.secondary, this.colors.border);

    this.doc
      .fillColor('white')
      .fontSize(this.fonts.header)
      .font('Helvetica-Bold')
      .text('SALARY SUMMARY', this.margin, startY + 6, {
        align: 'center',
        width: this.contentWidth
      });

    // Summary details (centered)
    const summaryY = startY + 30;

    // Gross Salary and Total Deductions (centered in one line)
    const summaryText = `Gross Salary: ₹${salary.gross.toFixed(2)}    |    Total Deductions: ₹${totalDeductions.toFixed(2)}`;
    this.doc
      .fillColor(this.colors.text)
      .fontSize(this.fonts.body)
      .font('Helvetica-Bold')
      .text(summaryText, this.margin, summaryY, {
        align: 'center',
        width: this.contentWidth
      });

    // Net salary highlight (centered)
    const netSalaryText = `NET SALARY: ₹${salary.net.toLocaleString()}`;
    this.doc
      .rect(this.margin + 20, summaryY + 20, this.contentWidth - 40, 18)
      .fillAndStroke(this.colors.primary, this.colors.primary);

    this.doc
      .fillColor('white')
      .fontSize(this.fonts.header)
      .font('Helvetica-Bold')
      .text(netSalaryText, this.margin + 20, summaryY + 24, {
        align: 'center',
        width: this.contentWidth - 40
      });
  }

  // === FOOTER SECTION ===
  renderFooter() {
    const footerY = this.pageHeight - 120;
    
    // Signature section
    const signatureWidth = 200;
    const leftSignX = this.margin + 20;
    const rightSignX = this.pageWidth - this.margin - signatureWidth - 20;

    // Employee signature
    this.doc
      .strokeColor(this.colors.border)
      .lineWidth(1)
      .moveTo(leftSignX, footerY + 20)
      .lineTo(leftSignX + signatureWidth, footerY + 20)
      .stroke();

    this.doc
      .fillColor(this.colors.text)
      .fontSize(this.fonts.body)
      .font('Helvetica-Bold')
      .text('Employee Signature', leftSignX, footerY + 25);

    // Manager signature
    this.doc
      .strokeColor(this.colors.border)
      .lineWidth(1)
      .moveTo(rightSignX, footerY + 20)
      .lineTo(rightSignX + signatureWidth, footerY + 20)
      .stroke();

    this.doc
      .fillColor(this.colors.text)
      .fontSize(this.fonts.body)
      .font('Helvetica-Bold')
      .text('Authorized Signature', rightSignX, footerY + 25);
  }

  // === UTILITY METHODS ===
  formatKey(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}

// Export function to maintain compatibility
function generatePayslipStream(salary, res) {
  const generator = new PayslipGenerator();
  generator.generatePayslipStream(salary, res);
}

module.exports = generatePayslipStream;