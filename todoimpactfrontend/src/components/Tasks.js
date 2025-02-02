import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Tasks({ token }) {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        console.log("Отправляемый токен:", token);
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

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Задачи</h2>
            {error && <div className="mb-4 p-3 text-red-700 bg-red-200 rounded-md">{error}</div>}
            <form onSubmit={handleCreateTask} className="mb-6">
                <div className="mb-4">
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Название задачи"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Описание задачи"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                    Создать задачу
                </button>
            </form>
            <ul>
                {tasks.map(task => (
                    <li key={task.id} className="p-4 bg-gray-100 rounded-lg shadow mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                        <p className="text-gray-600">{task.description}</p>
                        <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="mt-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300">
                            Удалить
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Tasks;
