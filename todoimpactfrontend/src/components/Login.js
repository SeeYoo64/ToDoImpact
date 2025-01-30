import React, { useState } from 'react';
import axios from 'axios';

function Login({ setToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`http://localhost:5253/api/auth/login`, {
                email,
                password
            });
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                alert('Logged in successfully!');
            } else {
                setError(response.data.errors.join(', '));
            }
        } catch (error) {
            console.error(error);
            setError('Login failed: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;