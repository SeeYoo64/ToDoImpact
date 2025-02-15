import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate(); // Хук для навигации

    const handleNavigateToArchive = () => {
        navigate('/archive'); // Переход на страницу архива
    };

    return (
        <div className="home">
            <h1>Добро пожаловать на главную страницу!</h1>
            <p>Это пример простого компонента Home.</p>
            <button onClick={handleNavigateToArchive} className="archive-button">
                Перейти в архив
            </button>
        </div>
    );
};

export default Home;