import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ token, setToken }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken('');
        navigate('/login');
    };

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                {token && <li><button onClick={handleLogout}>Logout</button></li>}
                {token && <li><Link to="/tasks">Tasks</Link></li>}
            </ul>
        </nav>
    );
}

export default Navbar;