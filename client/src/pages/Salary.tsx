import  { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import './Salary.css';
import API from '../services/Api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';






// Define types for our state
interface IField {
    [key: string]: string;
}

const Salary = () => {
  const [employees, setEmployees] = useState<{ _id: string; name: string }[]>([]);
  const [selectedEmpId, setSelectedEmployeeId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const [earnings, setEarnings] = useState<IField>({
    'Basic + HRA': '',
    'Conveyance': '',
    'Spl Allowanance': '', // Corrected typo from image
    'Sales Incentives': '',
    'Per call Inc': '',
    'Road show promo': '',
    'Attendance allowance': '',
  });

  const [deductions, setDeductions] = useState<IField>({
    'Advance': '',
    'Loan': '',
    'Sales Debits': '',
    'Under performance': '',
  });

  const [grossPay, setGrossPay] = useState<number>(0);
  const [totalDeductions, setTotalDeductions] = useState<number>(0);
  const [netPay, setNetPay] = useState<number>(0);
  const location = useLocation();
  const editData = location.state || null;

  // --- Effects ---

  // Fetch employees on component mount

useEffect(() => {
  API.get('/employees')
    .then(res => setEmployees(res.data))
    .catch(err => {
      console.error('Failed to fetch employees:', err);
    });
}, []);



  // Recalculate salary whenever earnings or deductions change
useEffect(() => {
  
  const totalEarnings = Object.values(earnings).reduce((acc: number, value) => acc + (parseFloat(value as string) || 0), 0);
  const totalDed = Object.values(deductions).reduce((acc: number, value) => acc + (parseFloat(value as string) || 0), 0);

  setGrossPay(Number(totalEarnings));
  setTotalDeductions(Number(totalDed));
  setNetPay(Number(totalEarnings) - Number(totalDed));
}, [earnings, deductions]);

useEffect(() => {
  if (editData) {
    setSelectedEmployeeId(editData.empId);
    setSelectedMonth(editData.month);
    setEarnings(editData.earnings);
    setDeductions(editData.deductions);

    const totalEarnings = Object.values(editData.earnings).reduce(
      (acc: number, value) => acc + (parseFloat(value as string) || 0), 0
    );
    const totalDed = Object.values(editData.deductions).reduce(
      (acc: number, value) => acc + (parseFloat(value as string) || 0), 0
    );

    setGrossPay(Number(totalEarnings));
    setTotalDeductions(Number(totalDed));
    setNetPay(Number(totalEarnings) - Number(totalDed));
  }
}, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: 'earnings' | 'deductions',
    fieldName: string
  ) => {
    const { value } = e.target;
    if (type === 'earnings') {
      setEarnings(prev => ({ ...prev, [fieldName]: value }));
    } else {
      setDeductions(prev => ({ ...prev, [fieldName]: value }));
    }
  };

  const handleAddField = (type: 'earnings' | 'deductions') => {
    const newFieldName = prompt(`Enter name for new ${type.slice(0, -1)} field:`);
    if (newFieldName) {
        if (type === 'earnings') {
            setEarnings(prev => ({ ...prev, [newFieldName]: '' }));
        } else {
            setDeductions(prev => ({ ...prev, [newFieldName]: '' }));
        }
    }
  };


const handleSave = async () => {
  if (!selectedEmpId || !selectedMonth) {
    toast.error('Please select an employee and a month.');
    return;
  }

  const formattedMonth = new Date(selectedMonth).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const salaryData = {
    employeeId: selectedEmpId, // ✅ fixed
    month: formattedMonth, // ✅ fixed
    earnings: Object.entries(earnings).reduce((acc, [key, value]) => {
      acc[key] = parseFloat(value) || 0;
      return acc;
    }, {} as Record<string, number>),
    deductions: Object.entries(deductions).reduce((acc, [key, value]) => {
      acc[key] = parseFloat(value) || 0;
      return acc;
    }, {} as Record<string, number>),
    gross: grossPay,
    net: netPay,
  };

  try {
    await API.post('/salary', salaryData); // ✅ token will auto-attach via interceptor
    toast.success('Salary saved successfully!');
  } catch (err: any) {
    console.error('❌ Error:', err);
    toast.error(err.response?.data?.msg || 'Failed to save salary');
  }
};

const [calendarDate, setCalendarDate] = useState<Date | null>(null);
useEffect(() => {
  // Set initial calendar date to current month
  const today = new Date();
  setCalendarDate(new Date(today.getFullYear(), today.getMonth(), 1));
}
, []);

  return (
    <div className="salary-container">
      <div className="salary-card">
        <h1 className="title">Salary</h1>

        <div className="form-row top-row">
            <div className="form-group">
                <label>Employee</label>
                <select value={selectedEmpId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
                    <option value="" disabled>Select employee</option>
                    {employees.map(emp => (
                        <option key={emp._id} value={emp._id}> 
                         {emp.name} 
                        </option>
                    ))}
                    
                </select>
            </div>
            <div className="form-group">
                <label>Month</label>
            <DatePicker
            selected={calendarDate}
            onChange={(date) => {
                setCalendarDate(date);
                const formatted = format(date!, 'MMMM-yyyy'); // e.g. June-2025
                setSelectedMonth(formatted); 
                }}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                showFullMonthYearPicker
                className="datepicker-input"/>
            </div>
        </div>

        <div className="form-row content-row">
          {/* Earnings Section */}
          <div className="column">
            <h2 className="column-title">Earnings</h2>
            {Object.keys(earnings).map(field => (
                <div className="form-group" key={field}>
                    <input
                        type="number"
                        placeholder={field}
                        value={earnings[field]}
                        onChange={(e) => handleInputChange(e, 'earnings', field)}
                    />
                </div>
            ))}
             <button className="btn-add" onClick={() => handleAddField('earnings')}>add</button>
          </div>

          {/* Deductions and Totals Section */}
          <div className="column">
            <h2 className="column-title">Deductions</h2>
            {Object.keys(deductions).map(field => (
                <div className="form-group" key={field}>
                    <input
                        type="number"
                        placeholder={field}
                        value={deductions[field]}
                        onChange={(e) => handleInputChange(e, 'deductions', field)}
                    />
                </div>
            ))}
            <button className="btn-add" onClick={() => handleAddField('deductions')}>add</button>

            <div className="totals-section">
                <div className="total-field">
                    <span>Gross pay :</span>
                    <strong>{grossPay.toFixed(2)}</strong>
                </div>
                <div className="total-field">
                    <span>Total Deductions :</span>
                    <strong>{totalDeductions.toFixed(2)}</strong>
                </div>
                 <div className="total-field net-pay">
                    <span>Net pay :</span>
                    <strong>{netPay.toFixed(2)}</strong>
                </div>
            </div>
          </div>
        </div>

        <div className="form-row footer-row">
            <button className="btn-save" onClick={handleSave}>save</button>
        </div>

      </div>
    </div>
  );
};

export default Salary;
