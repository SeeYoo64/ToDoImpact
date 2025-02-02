import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Вход</h2>
                {error && <div className="mb-4 p-2 text-red-600 bg-red-100 rounded-md">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-1">Email:</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-1">Пароль:</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
