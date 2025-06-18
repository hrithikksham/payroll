import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaWaveSquare, FaFileAlt } from 'react-icons/fa';
import logo from '../assets/anjo.png'; // Make sure this path is correct
import './Sidebar.css';

function handleLogout() {
    // Your logout logic here
    // For example:
    // localStorage.removeItem('token');
    // window.location.href = '/login';
    console.log('Logout clicked');
}

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <div className="sidebar-logo">
                    <img src={logo} alt="Anjo The Water Expert" />
                </div>
                <hr className="sidebar-divider" />
                <nav className="sidebar-links">
                    <NavLink to="/dashboard" className="nav-item">
                        <FaHome className="nav-icon" />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/employees" className="nav-item">
                        <FaUsers className="nav-icon" />
                        <span>Employees</span>
                    </NavLink>
                    <NavLink to="/salary" className="nav-item">
                        <FaWaveSquare className="nav-icon" />
                        <span>Calculation</span>
                    </NavLink>
                    <NavLink to="/reports" className="nav-item">
                        <FaFileAlt className="nav-icon" />
                        <span>Reports</span>
                    </NavLink>
                </nav>
            </div>

            <div className="sidebar-bottom">
                <div onClick={handleLogout} className="sign-out-button">
                    Sign out
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;