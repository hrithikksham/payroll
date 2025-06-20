import { useEffect, useState } from 'react';
import API from '../services/Api';
import toast from 'react-hot-toast';
import './Reports.css';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { TailSpin } from 'react-loader-spinner'; // ⬅️ Spinner component

interface SalaryEntry {
  _id: string;
  net: number;
  employeeId?: {
    empId: string;
    name: string;
    designation: string;
  };
  employeeSnapshot?: {
    empId: string;
    name: string;
    designation: string;
  };
}

function Reports() {
  const [month, setMonth] = useState('');
  const [salaries, setSalaries] = useState<SalaryEntry[]>([]);
  const [calendarDate, setCalendarDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const tryFormats = async (month: string) => {
  try {
    const encoded1 = encodeURIComponent(month); // "June 2025"
    const res1 = await API.get(`/salary/${encoded1}`);
    if (res1.data?.length) return res1.data;
  } catch {}

  try {
    const fallback = month.replace(' ', '-'); // "June-2025"
    const encoded2 = encodeURIComponent(fallback);
    const res2 = await API.get(`/salary/${encoded2}`);
    return res2.data;
  } catch {}

  return [];
};

const fetchReports = async (selectedMonth: string) => {
  if (!selectedMonth) return;
  setLoading(true);
  try {
    const data = await tryFormats(selectedMonth);
    if (data.length === 0) toast.error('No reports found for this month');
    setSalaries(data);
  } catch (err) {
    toast.error('Error fetching reports');
  } finally {
    setLoading(false);
  }
};

const downloadMonthlyPDF = async () => {
  if (!month) return toast.error('Select a month first');
  try {
    const encodedMonth = encodeURIComponent(month.trim());
    const res = await API.get(`/salary/report/${encodedMonth}/pdf`, {
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Salary_Report_${month}.pdf`);
    document.body.appendChild(link);
    link.click();
  } catch (err) {
    toast.error('Failed to download PDF');
  }
};

const handleDelete = async (id: string) => {
  if (!window.confirm('Are you sure you want to delete this salary record?')) return;

  try {
    await API.delete(`/salary/${id}`);
    toast.success('Salary deleted');
    fetchReports(month); // refresh current view
  } catch (err: any) {
    toast.error(err.response?.data?.msg || 'Delete failed');
  }
};

    const downloadPayslip = async (id: string) => {
        try {
            const response = await API.get(`/salary/${id}/payslip`, {
            responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Payslip_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            } catch (err) {
                toast.error('Download failed');
  }
};

  const handleMonthChange = (date: Date | null) => {
    if (!date) return;
    setCalendarDate(date);
    const formatted = format(date, 'MMMM yyyy');
    setMonth(formatted);
    fetchReports(formatted);
  };

  useEffect(() => {
    const now = new Date();
    const formatted = format(now, 'MMMM yyyy');
    setMonth(formatted);
    setCalendarDate(now);
    fetchReports(formatted);
  }, []);

  return (
    <div className="reports-container">
      <h1>Reports</h1>

      <div className="date-picker-container">
        <DatePicker
          selected={calendarDate}
          onChange={handleMonthChange}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          showFullMonthYearPicker
          className="datepicker-input"
          placeholderText="Select month"
        />
      </div>

      <button className="download-btn" onClick={downloadMonthlyPDF}> 📄 Download Monthly Report </button>

      <div className="table-wrapper">
        {loading ? (
          <div className="spinner">
            <TailSpin height="60" width="60" color="#007bff" ariaLabel="loading" />
          </div>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>EMP id</th>
                <th>Name of the Employee</th>
                <th>Designation</th>
                <th>Net Salary</th>
                <th>Payslip</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {salaries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }}>
                    No data found for selected month
                  </td>
                </tr>
              ) : (
                salaries.map((entry) => (
                  <tr key={entry._id}>
                    <td>{entry.employeeId?.empId || entry.employeeSnapshot?.empId || 'N/A'}</td>
                    <td>{entry.employeeId?.name || entry.employeeSnapshot?.name || 'N/A'}</td>
                    <td>{entry.employeeId?.designation ||entry.employeeSnapshot?.designation||'N/A'}</td>
                    <td>{entry.net?.toFixed(2) || '0.00'}</td>
                    <td>
                      <button
                        className="download-btn"
                        onClick={() => downloadPayslip(entry._id)}
                      >
                        Download

                      </button>
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => navigate('/salary', { state: entry })}
                      >
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(entry._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Reports;