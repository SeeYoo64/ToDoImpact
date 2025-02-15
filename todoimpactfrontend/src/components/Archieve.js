import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Archive.css'; // Импортируем файл со стилями

function Archive({ token }) {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log("Отправляемый токен:", token);
        const fetchArchivedTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:5253/api/tasks`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTasks(response.data);
            } catch (error) {
                console.error("Ошибка при получении задач:", error.response?.status, error.response?.data);
                setError(`Ошибка загрузки задач: ${error.message}`);
            }
        };
        fetchArchivedTasks();
    }, [token]);

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5253/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.reload(); // Перезагружаем страницу после удаления задачи
        } catch (error) {
            console.error('Ошибка при удалении задачи:', error);
        }
    };
    return (
        <div className="archive-container">
            <h2 className="archive-title">Архив задач</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="task-list-archieve">
                {tasks
                    .filter(task => task.isCompleted) // Фильтруем выполненные задачи
                    .map(task => (
                        <div key={task.id} className="task-item">
                            <h3 className="task-title">{task.title}</h3>
                            <p className="task-description">{task.description}</p>
                            <p className="task-completed-date">Выполнено: {task.completedAt ? new Date(task.completedAt).toLocaleString() : 'Не указано'}</p>
                            <button onClick={() => handleDeleteTask(task.id)} className="task-delete-button">Удалить</button>
                        </div>
                    ))}
            </div>
        </div>
    );
}



export default Archive;