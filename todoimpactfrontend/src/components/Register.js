// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './css/Register.css'; // Импортируем файл со стилями

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`http://localhost:5253/api/auth/register`, {
                username,
                email,
                password
            });
            if (response.data.success) {
                alert('Registration successful!');
            } else {
                setError(response.data.errors.join(', '));
            }
        } catch (error) {
            console.error(error);
            setError('Registration failed: ' + error.message);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Регистрация</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="task-form">


                    <div className="form-group">
                        <label htmlFor="email" className="label">Имя пользователя:</label>
                        <input
                            type="username"
                            id="username"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

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




                    <button type="submit" className="task-create-button">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    );
}

export default Register;