// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Обратите внимание на изменение импорта
import './components/css/theme.css'; // Подключаем файл с темами
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);