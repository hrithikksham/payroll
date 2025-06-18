
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
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;