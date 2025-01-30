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
        <div className="App">
            <Navbar token={token} setToken={setToken} />
            <Routes>
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/tasks"
                    element={<ProtectedRoute token={token}><Tasks /></ProtectedRoute>}
                />
            </Routes>
        </div>
    );
}

export default App;