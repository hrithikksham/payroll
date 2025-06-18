import React, { useState, useEffect } from 'react';
import API from '../services/Api';
import toast from 'react-hot-toast';
import { ChevronDown, Trash2 } from 'lucide-react';

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
    <div style={{ padding: '40px', background: '#f3f4f6', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Employees</h1>

      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div onClick={() => setIsFormExpanded(!isFormExpanded)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Add Employee</h2>
          <ChevronDown style={{ transform: isFormExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s' }} />
        </div>

        {isFormExpanded && (
          <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
              <input placeholder="EMP ID" value={empId} onChange={e => setEmpId(e.target.value)} required />
              <input placeholder="Phone" value={phoneNo} onChange={e => setPhoneNo(e.target.value)} required />
              <input placeholder="Designation" value={designation} onChange={e => setDesignation(e.target.value)} required />
              <input type="number" placeholder="Base Salary" value={baseSalary} onChange={e => setBaseSalary(e.target.value)} required />
            </div>
            <button type="submit" style={{ padding: '10px', background: '#000', color: '#fff', borderRadius: '5px' }}>Add</button>
          </form>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', padding: '1rem' }}>
        {employees.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No employees added yet</p>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', fontWeight: 'bold', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #ddd' }}>
              <div>EMP ID</div>
              <div>Name</div>
              <div>Designation</div>
              <div>Phone</div>
              <div>Actions</div>
            </div>
            {employees.map(emp => (
              <div
                key={emp._id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  animation: 'fadeIn 0.5s ease'
                }}
              >
                <div>{emp.empId}</div>
                <div>{emp.name}</div>
                <div>{emp.designation}</div>
                <div>{emp.phone}</div>
                <div>
                  <button onClick={() => handleDelete(emp._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>
        {`
          input {
            flex: 1;
            padding: 0.5rem;
            border-radius: 5px;
            border: 1px solid #ccc;
            min-width: 160px;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Employees;