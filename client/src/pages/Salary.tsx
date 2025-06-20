import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import './Salary.css';
import API from '../services/Api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import { useLocation } from 'react-router-dom';

interface IField {
  [key: string]: string;
}

const Salary = () => {
  const [employees, setEmployees] = useState<{ _id: string; name: string }[]>([]);
  const [selectedEmpId, setSelectedEmployeeId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [calendarDate, setCalendarDate] = useState<Date | null>(null);

  const [earnings, setEarnings] = useState<IField>({
    'Basic + HRA': '',
    'Conveyance': '',
    'Spl Allowanance': '',
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

  // Fetch employees then apply edit data

useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const res = await API.get('/employees');
      setEmployees(res.data);

      // If editing existing data
      if (editData) {
        // Support both string or object format for employeeId
        const empId =
          typeof editData.employeeId === 'object'
            ? editData.employeeId._id
            : editData.employeeId || editData.empId;

        setSelectedEmployeeId(empId);
        setSelectedMonth(editData.month);
        setEarnings(editData.earnings || {});
        setDeductions(editData.deductions || {});

        // Safely parse "June 2025" or "June-2025"
        const parsed =
          parse(editData.month, 'MMMM yyyy', new Date()).toString() !== 'Invalid Date'
            ? parse(editData.month, 'MMMM yyyy', new Date())
            : parse(editData.month, 'MMMM-yyyy', new Date());

        if (!isNaN(parsed.getTime())) {
          setCalendarDate(parsed);
        }

        const totalEarnings = Object.values(editData.earnings || {}).reduce(
          (acc: number, val) => acc + (parseFloat(val as string) || 0), 0
        );
        const totalDeductions = Object.values(editData.deductions || {}).reduce(
          (acc: number, val) => acc + (parseFloat(val as string) || 0), 0
        );

        setGrossPay(totalEarnings);
        setTotalDeductions(totalDeductions);
        setNetPay(totalEarnings - totalDeductions);
      }
    } catch (err) {
      toast.error('Failed to fetch employees');
      console.error('Employee Fetch Error:', err);
    }
  };

  fetchEmployees();
}, []);
  // Recalculate totals if fields change
  useEffect(() => {
    const totalEarnings = Object.values(earnings).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
    const totalDeductions = Object.values(deductions).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
    setGrossPay(totalEarnings);
    setTotalDeductions(totalDeductions);
    setNetPay(totalEarnings - totalDeductions);
  }, [earnings, deductions]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: 'earnings' | 'deductions',
    field: string
  ) => {
    const value = e.target.value;
    if (type === 'earnings') {
      setEarnings(prev => ({ ...prev, [field]: value }));
    } else {
      setDeductions(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAddField = (type: 'earnings' | 'deductions') => {
    const newField = prompt(`Enter name for new ${type.slice(0, -1)} field:`);
    if (newField) {
      if (type === 'earnings') {
        setEarnings(prev => ({ ...prev, [newField]: '' }));
      } else {
        setDeductions(prev => ({ ...prev, [newField]: '' }));
      }
    }
  };
const handleSave = async () => {
  if (!selectedEmpId || !selectedMonth) {
    toast.error('Please select an employee and a month.');
    return;
  }

  const salaryData = {
    employeeId: selectedEmpId,
    month: selectedMonth,
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
    if (editData && editData._id) {
      await API.put(`/salary/${editData._id}`, salaryData);
      toast.success('Salary updated!');
    } else {
      await API.post('/salary', salaryData);
      toast.success('Salary saved!');
    }

    // ✅ Reset amounts after saving
    const resetFields = (obj: IField) =>
      Object.keys(obj).reduce((acc, key) => {
        acc[key] = '';
        return acc;
      }, {} as IField);

    setEarnings(prev => resetFields(prev));
    setDeductions(prev => resetFields(prev));
    setGrossPay(0);
    setTotalDeductions(0);
    setNetPay(0);
    
  } catch (err: any) {
    toast.error(err.response?.data?.msg || 'Save failed');
  }
};

  return (
    <div className="salary-container">
      <div className="salary-card">
        <h1 className="title">Salary</h1>

        <div className="form-row top-row">
          <div className="form-group">
            <label>Employee</label>
            <div className="select-container">
              <select value={selectedEmpId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
                <option value="" disabled>Select employee</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Month</label>
            <DatePicker
              selected={calendarDate}
              onChange={(date) => {
                setCalendarDate(date);
                setSelectedMonth(format(date!, 'MMMM-yyyy'));
              }}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="datepicker-input"
              placeholderText='Select month'
            />
          </div>
        </div>

        <div className="form-row content-row">
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
            <button className="btn-add" onClick={() => handleAddField('earnings')}>Add</button>
          </div>

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
            <button className="btn-add" onClick={() => handleAddField('deductions')}>Add</button>

            <div className="totals-section">
              <div className="total-field"><span>Gross Pay:</span><strong>{grossPay.toFixed(2)}</strong></div>
              <div className="total-field"><span>Total Deductions:</span><strong>{totalDeductions.toFixed(2)}</strong></div>
              <div className="total-field net-pay"><span>Net Pay:</span><strong>{netPay.toFixed(2)}</strong></div>
            </div>
          </div>
        </div>

        <div className="form-row footer-row">
          <button className="btn-save" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default Salary;