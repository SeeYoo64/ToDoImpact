import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Tasks({ token }) {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:5253/api/tasks/tasks`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTasks(response.data);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch tasks: ' + error.message);
            }
        };

        fetchTasks();
    }, [token]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`http://localhost:5253/api/tasks`, newTask, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks([...tasks, response.data]);
            setNewTask({ title: '', description: '' });
            alert('Task created successfully!');
        } catch (error) {
            console.error(error);
            setError('Failed to create task: ' + error.message);
        }
    };

    const handleUpdateTask = async (id, updatedTask) => {
        setError('');
        try {
            await axios.put(`http://localhost:5253/api/tasks/tasks/${id}`, updatedTask, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedTasks = tasks.map(task =>
                task.id === id ? { ...task, ...updatedTask } : task
            );
            setTasks(updatedTasks);
            alert('Task updated successfully!');
        } catch (error) {
            console.error(error);
            setError('Failed to update task: ' + error.message);
        }
    };

    const handleDeleteTask = async (id) => {
        setError('');
        try {
            await axios.delete(`http://localhost:5253/api/tasks/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedTasks = tasks.filter(task => task.id !== id);
            setTasks(updatedTasks);
            alert('Task deleted successfully!');
        } catch (error) {
            console.error(error);
            setError('Failed to delete task: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Tasks</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleCreateTask}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Create Task</button>
            </form>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>{task.isCompleted ? 'Completed' : 'Pending'}</p>
                        <button onClick={() => handleUpdateTask(task.id, { ...task, isCompleted: !task.isCompleted })}>
                            {task.isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Tasks;