import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Tasks from './components/Tasks';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar token={token} setToken={setToken} />
            <div className="container mx-auto p-4">
                <Routes>
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/tasks"
                        element={<ProtectedRoute token={token}><Tasks token={token} /></ProtectedRoute>}
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;