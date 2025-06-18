import  { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import './Salary.css';
import API from '../services/Api';


const generateMonthYears = () => {
  const options: string[] = [];
  const currentYear = new Date().getFullYear();

  for (let y = currentYear - 2; y <= currentYear + 3; y++) {
    for (let m = 0; m < 12; m++) {
      const date = new Date(y, m);
      const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      options.push(label); // e.g., June 2025
    }
  }
  return options;
};

const monthYears = generateMonthYears();

// Define types for our state
interface IField {
    [key: string]: string;
}

const Salary = () => {
  const [employees, setEmployees] = useState<{ _id: string; name: string }[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
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

  // --- Effects ---

  // Fetch employees on component mount

useEffect(() => {
  API.get('/employees')
    .then(res => setEmployees(res.data))
    .catch(err => {
      console.error('Failed to fetch employees:', err);
    });
}, []);

 useEffect(() => {
  if (!selectedEmployeeId) return;

  fetch(`/api/employees/${selectedEmployeeId}`)
    .then(res => res.json())
    .then(data => {
      setEarnings(prev => ({
        ...prev,
        'Basic + HRA': data.baseSalary?.toString() || ''
      }));
    })
    .catch(() => toast.error("Failed to load employee base salary"));
}, [selectedEmployeeId]);


  // Recalculate salary whenever earnings or deductions change
  useEffect(() => {
    const totalEarnings = Object.values(earnings).reduce((acc, value) => acc + (parseFloat(value) || 0), 0);
    const totalDed = Object.values(deductions).reduce((acc, value) => acc + (parseFloat(value) || 0), 0);

    setGrossPay(totalEarnings);
    setTotalDeductions(totalDed);
    setNetPay(totalEarnings - totalDed);
  }, [earnings, deductions]);


  // --- Handlers ---

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

  const handleSave = () => {
    if (!selectedEmployeeId || !selectedMonth) {
        toast.caller('Please select an employee and a month.');
        return;
    }

    // This object matches your Mongoose schema
    const salaryData = {
        empId: selectedEmployeeId,
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

    console.log('--- Saving Salary Data ---');
    console.log(JSON.stringify(salaryData, null, 2));

    alert('Salary data prepared. Check the console for the output.');
  };


  return (
    <div className="salary-container">
      <div className="salary-card">
        <h1 className="title">Salary</h1>

        <div className="form-row top-row">
            <div className="form-group">
                <label>Employee</label>
                <select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
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
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="" disabled>Select month</option>
            {monthYears.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
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
