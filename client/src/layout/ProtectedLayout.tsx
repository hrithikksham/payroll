// src/layout/ProtectedLayout.tsx

import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const ProtectedLayout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          padding: '2rem',
          marginLeft: '220px', // Same width as sidebar
          width: 'calc(100% - 220px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button onClick={handleLogout}>Sign Out</button>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;