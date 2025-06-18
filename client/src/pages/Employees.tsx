import React, { useState, useEffect } from 'react';
import API from '../services/Api';
import toast from 'react-hot-toast';
import { ChevronDown, Trash2 } from 'lucide-react';
import './Employees.css'; 

type Employee = {
  _id: string;
  empId: string;
  name: string;
  designation: string;
  phone: string;
  baseSalary?: string;
};

const Employees = () => {
  const [name, setName] = useState('');
  const [empId, setEmpId] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [designation, setDesignation] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isFormExpanded, setIsFormExpanded] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get('/employees');
      setEmployees(res.data);
    } catch {
      toast.error('Failed to fetch employees');
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/employees', {
        name,
        empId,
        phone: phoneNo,
        designation,
        baseSalary,
      });
      toast.success('Employee added!');
      setName('');
      setEmpId('');
      setPhoneNo('');
      setDesignation('');
      setBaseSalary('');
      fetchEmployees();
    } catch (err: any) {
      toast.error(err.response?.data?.msg || 'Add failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/employees/${id}`);
      toast.success('Deleted');
      fetchEmployees();
    } catch {
      toast.error('Delete failed');
    }
  };

return (
    <div className="employees-container">
      <h1 className="employees-header">Employees</h1>

      <div className="form-card">
        <div className="form-toggle" onClick={() => setIsFormExpanded(!isFormExpanded)}>
          <h2 className="form-title">Add Employee</h2>
          <ChevronDown className={`chevron-icon ${isFormExpanded ? 'expanded' : ''}`} />
        </div>

        {isFormExpanded && (
          <form onSubmit={handleAddEmployee} className="employee-form">
            <div className="form-inputs">
              <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
              <input placeholder="EMP ID" value={empId} onChange={e => setEmpId(e.target.value)} required />
              <input placeholder="Phone" value={phoneNo} onChange={e => setPhoneNo(e.target.value)} required />
              <input placeholder="Designation" value={designation} onChange={e => setDesignation(e.target.value)} required />
              <input type="number" placeholder="Base Salary" value={baseSalary} onChange={e => setBaseSalary(e.target.value)} required />
            </div>
            <button type="submit" className="add-button">+ Add</button>
          </form>
        )}
      </div>

      <div className="employees-list-card">
        {employees.length === 0 ? (
          <p className="no-employees-message">No employees added yet</p>
        ) : (
          <div>
            <div className="employees-grid-header">
              <div>EMP ID</div>
              <div>Name</div>
              <div>Designation</div>
              <div>Phone</div>
              <div>Actions</div>
            </div>
            {employees.map(emp => (
              <div key={emp._id} className="employee-row">
                <div>{emp.empId}</div>
                <div>{emp.name}</div>
                <div>{emp.designation}</div>
                <div>{emp.phone}</div>
                <div>
                  <button onClick={() => handleDelete(emp._id)} className="delete-button">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;