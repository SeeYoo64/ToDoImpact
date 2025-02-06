// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Tasks from './components/Tasks';
import { ThemeProvider } from './ThemeContext';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    return (
        <ThemeProvider>
            <Router>
                <div className="app-container">
                    <Navbar token={token} setToken={setToken} />
                    <Routes>
                        <Route path="/login" element={<Login setToken={setToken} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/tasks" element={<Tasks token={token} />} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;