import { useState } from 'react';
import API from '../services/Api';
import { useNavigate } from 'react-router-dom';

const Salary = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [salary, setSalary] = useState('');
  const navigate = useNavigate();

  const handleUpdateSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/salary/update', { employeeId, salary });
      alert('Salary updated successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Failed to update salary');
    }
  };

  return (
    <div className="salary-form">
      <h3>Update Employee Salary</h3>
      <form onSubmit={handleUpdateSalary}>
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={e => setEmployeeId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="New Salary"
          value={salary}
          onChange={e => setSalary(e.target.value)}
          required
        />
        <button type="submit">Update Salary</button>
      </form>
    </div>
  );
}
export default Salary;
