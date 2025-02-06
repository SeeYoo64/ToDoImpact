// src/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import './css/Navbar.css'; // Импортируем файл со стилями

function Navbar({ token, setToken }) {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken('');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item"><Link to="/" className="navbar-link">Home</Link></li>
                {!token && <li className="navbar-item"><Link to="/login" className="navbar-link">Login</Link></li>}
                {!token && <li className="navbar-item"><Link to="/register" className="navbar-link">Register</Link></li>}

                {token && <li className="navbar-item"><Link to="/tasks" className="navbar-link">Tasks</Link></li>}
                <li className="navbar-item"><button onClick={toggleTheme} className="navbar-button switch">Toggle Theme</button></li>
                {token && <li className="navbar-item"><button onClick={handleLogout} className="navbar-button">Logout</button></li>}
            </ul>
        </nav>
    );
}

export default Navbar;