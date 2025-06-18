import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../services/Api';
import logo from '../assets/anjo.png';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { email, password });
      toast.success(' User Registration successful!');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
  <div className="auth-card">
   <img src={logo} alt="Your Logo" style={{ width: '100px', marginBottom: '1rem' }} />
    <h3>Register your account</h3>
    <form onSubmit={handleRegister}>
      <input
        type="email"
        placeholder="Email ID"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">REGISTER</button>
      <p className="auth-link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </form>
  </div>
  );
};

export default Register;