import { useState} from 'react';
import API from '../services/Api';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const [reportType, setReportType] = useState('attendance');
  const [reportData, setReportData] = useState(null);
  const navigate = useNavigate();

  const fetchReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.get(`/reports/${reportType}`);
      setReportData(res.data);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  return (
    <div className="report-container">
      <h3>Generate Report</h3>
      <form onSubmit={fetchReport}>
        <select value={reportType} onChange={e => setReportType(e.target.value)}>
          <option value="attendance">Attendance</option>
          <option value="salary">Salary</option>
          <option value="performance">Performance</option>
        </select>
        <button type="submit">Fetch Report</button>
      </form>
      {reportData && (
        <div className="report-data">
          <h4>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h4>
          <pre>{JSON.stringify(reportData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
export default Reports;
