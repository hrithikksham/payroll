import { useLocation } from 'react-router-dom';
import './Payslip.css';
import companyLogo from '../assets/logo.png';
import API from '../services/Api';

const Payslip = () => {
  const location = useLocation();
  const data = location.state;

  if (!data) return <div className="payslip-container">No payslip data provided</div>;

  const { _id, employeeSnapshot, earnings, deductions, gross, net, month } = data;

  const handleDownloadPDF = async () => {
    try {
      const response = await API.get(`/salary/${_id}/payslip`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Payslip_${employeeSnapshot.name}_${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download payslip PDF:', err);
      alert('Error downloading payslip');
    }
  };

  return (
    <div className="payslip-container">
      <div className="payslip-card" id="print-area">
        <header className="payslip-header">
          <img src={companyLogo} alt="Company Logo" className="logo" />
          <h1>Payslip</h1>
          <p>{month}</p>
        </header>

        <section className="employee-details">
          <div><strong>Employee ID:</strong> {employeeSnapshot.empId}</div>
          <div><strong>Name:</strong> {employeeSnapshot.name}</div>
          <div><strong>Designation:</strong> {employeeSnapshot.designation}</div>
        </section>

        <div className="pay-section">
          <div className="column">
            <h3>Earnings</h3>
            {Object.entries(earnings).map(([key, value]) => (
              <div key={key} className="row">
                <span>{key}</span>
                <span>₹{String(value)}</span>
              </div>
            ))}
          </div>

          <div className="column">
            <h3>Deductions</h3>
            {Object.entries(deductions).map(([key, value]) => (
              <div key={key} className="row">
                <span>{key}</span>
                <span>₹{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="summary">
          <div><strong>Gross Pay:</strong> ₹{gross.toFixed(2)}</div>
          <div><strong>Total Deductions:</strong> ₹{(gross - net).toFixed(2)}</div>
          <div><strong>Net Pay:</strong> ₹{net.toFixed(2)}</div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="print-btn" onClick={() => window.print()}>🖨 Print</button>
        <button className="download-btn" onClick={handleDownloadPDF}>⬇️ Download PDF</button>
      </div>
    </div>
  );
};

export default Payslip;