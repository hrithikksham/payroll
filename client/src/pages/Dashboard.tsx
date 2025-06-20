import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './Dashboard.css';
import API from '../services/Api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

interface SalaryData {
  month: string;
  total: number;
}

interface DashboardData {
  totalEmployees: number;
  totalSalary: number;
  averageSalary: number;
  monthlyData: SalaryData[];
  availableYears: number[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    totalEmployees: 0,
    totalSalary: 0,
    averageSalary: 0,
    monthlyData: [],
    availableYears: []
  });
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [employeesRes, salaryRes, yearsRes] = await Promise.all([
          API.get('/employees'),
          API.get(`/salary/year/${selectedYear}`),
          API.get('/salary/years')
        ]);

        const employees = employeesRes.data;
        const salaryResponse = salaryRes.data;
        const years = yearsRes.data;

        const monthlyData = Object.entries(salaryResponse.monthlyBreakdown || {}).map(
          ([month, total]) => ({
            month: month.toLowerCase().slice(0, 3),
            total: total as number
          })
        );

        const monthOrder = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        monthlyData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

        setData({
          totalEmployees: Array.isArray(employees) ? employees.length : (employees.count || 0),
          totalSalary: salaryResponse.totalSpendings || 0,
          averageSalary: salaryResponse.totalSpendings && employees.length
          ? Math.round(salaryResponse.totalSpendings / employees.length): 0,
          monthlyData,
          availableYears: years.map((y: string | number) => parseInt(y.toString()))
        });

        setError(null);
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString()}`;

  if (loading) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2 className="card-title">Total Salary Spendings</h2>
          <div className="card-value">{formatCurrency(data.totalSalary)}</div>
          <div className="card-subtitle">for year {selectedYear}</div>
        </div>

        <div className="dashboard-card">
          <h2 className="card-title">Average Net Salary </h2>
          <div className="card-value">{formatCurrency(data.averageSalary)}</div>
          <div className="card-subtitle">based on year {selectedYear}</div>
        </div>

        <div className="dashboard-card">
          <h2 className="card-title">Total Employees</h2>
          <div className="card-value">{data.totalEmployees}</div>
        </div>
      </div>

      <div className="chart-container">
        <div className="year-selector">
          <select 
            value={selectedYear} 
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="year-dropdown"
          >
            {data.availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <ChevronDown className="dropdown-icon" />
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `Rs. ${value.toLocaleString()}`} />
          <Bar dataKey="total" fill="#333" />
          </BarChart>
        </ResponsiveContainer>
        </div>
      </div>
  );
};

export default Dashboard;
