import { useState } from 'react';
import API from '../services/Api';
import toast from 'react-hot-toast';
import './Reports.css';

interface SalaryEntry {
  _id: string;
  net: number;
  employeeId: {
    empId: string;
    name: string;
    designation: string;
  };
}

function Reports() {
  // Add state for month and salaries
  const [month, setMonth] = useState('');
  const [salaries, setSalaries] = useState<SalaryEntry[]>([]);

  const fetchReports = async (selectedMonth: string) => {
    if (!selectedMonth) return;

    try {
      const encodedMonth = encodeURIComponent(selectedMonth.trim()); // e.g., "June 2025" => "June%202025"
      const res = await API.get(`/salary/${encodedMonth}`);
      setSalaries(res.data);
    } catch (err: any) {
      console.error('Fetch salary report error:', err.message);
      toast.error(err.response?.data?.msg || 'Failed to fetch salary reports');
      setSalaries([]);
    }
  };

  const downloadPayslip = async (id: string) => {
    try {
      const response = await API.get(`/salary/${id}/payslip`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'payslip.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      toast.error('Download failed');
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, monthNum] = e.target.value.split('-');
    const date = new Date(Number(year), Number(monthNum) - 1);
    const formatted = date.toLocaleString('default', { month: 'long', year: 'numeric' }); // June 2025
    setMonth(e.target.value);
    fetchReports(formatted);
  };

  return (
    <div className="reports-container">
      <h1>Reports</h1>

    <input
      type="month"
      value={month}
      onChange={handleMonthChange}
      className="month-selector"
    />

    <div className="table-wrapper">
      <table className="report-table">
        <thead>
          <tr>
            <th>EMP id</th>
            <th>Name of the Employee</th>
            <th>Designation</th>
            <th>Net Salary</th>
            <th>Payslip</th>
          </tr>
        </thead>
        <tbody>
          {salaries.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>
                No data found for selected month
              </td>
            </tr>
          ) : (
            salaries.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.employeeId?.empId || 'N/A'}</td>
                <td>{entry.employeeId?.name || 'N/A'}</td>
                <td>{entry.employeeId?.designation || 'N/A'}</td>
                <td>{entry.net?.toFixed(2) || '0.00'}</td>
                <td>
                  <button
                    className="download-btn"
                    onClick={() => downloadPayslip(entry._id)}
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
  );
}

export default Reports;