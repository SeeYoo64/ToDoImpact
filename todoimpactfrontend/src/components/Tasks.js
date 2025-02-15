import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Tasks.css'; // Импортируем файл со стилями

function Tasks({ token }) {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [error, setError] = useState('');

    const fetchTasks = async () => {
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

    useEffect(() => {
        fetchTasks();
    }, [token]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5253/api/tasks`, newTask, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks([...tasks, response.data]);
            setNewTask({ title: '', description: '' });
        } catch (error) {
            setError('Ошибка создания задачи: ' + error.message);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5253/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            setError('Ошибка удаления задачи: ' + error.message);
        }
    };

    const handleCompleteTask = async (id) => {
        try {
            await axios.post(`http://localhost:5253/api/tasks/${id}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks(); // Перезагружаем список задач
        } catch (error) {
            console.error('Ошибка при выполнении задачи:', error);
            setError('Ошибка выполнения задачи: ' + error.message);
        }
    };

    return (
        <div className="tasks-container">
            <div className="task-form-container">
                <h2 className="tasks-title">Создать новую задачу</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleCreateTask} className="task-form">
                    <div className="mb-4">
                        <input
                            type="text"
                            className="task-input"
                            placeholder="Название задачи"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <textarea
                            className="task-textarea"
                            placeholder="Описание задачи"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="task-create-button">Создать задачу</button>
                </form>
            </div>
            <div className="task-list-container">
                <h2 className="tasks-title">Список задач</h2>
                <ul className="task-list">
                    {tasks
                        .filter(task => !task.isCompleted) // Фильтруем невыполненные задачи
                        .map(task => (
                            <li key={task.id} className="task-item">
                                <h3 className="task-title">{task.title}</h3>
                                <p className="task-description">{task.description}</p>
                                <div className="task-buttons">
                                    <button onClick={() => handleDeleteTask(task.id)} className="task-delete-button">Удалить</button>
                                    <button onClick={() => handleCompleteTask(task.id)} className="task-completed-button">Выполнено</button>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}

export default Tasks;