// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Login.css'; // Импортируем файл со стилями

function Login({ setToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`http://localhost:5253/api/auth/login`, { email, password });
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                navigate('/tasks');
            } else {
                setError(response.data.errors.join(', '));
            }
        } catch (error) {
            setError('Ошибка входа: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Вход</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="label">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="button">Войти</button>
                </form>
            </div>
        </div>
    );
}

export default Login;