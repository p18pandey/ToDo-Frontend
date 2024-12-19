import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [tasks]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleEdit = async (id, updatedTask) => {
        try {
            const response = await axios.put(`http://localhost:5000/tasks/${id}`, updatedTask);
            setTasks((prev) =>
                prev.map((task) => (task._id === id ? response.data : task))
            );
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/tasks/${id}`);
            setTasks((prev) => prev.filter((task) => task._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const response = await axios.patch(`http://localhost:5000/tasks/${taskId}/status`, {
                status: newStatus,
            });
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? { ...task, status: response.data.status } : task
                )
            );
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };
    
    
    return (
        <div className="flex flex-col items-center space-y-6 p-6 m-4 border border-gray-200 rounded-lg shadow-md ml-6">
            <h2 className="text-3xl font-semibold text-gray-800 underline">Task List</h2>
            <ul className="w-full space-y-4">
                {tasks.map((task) => (
                    <li
                        key={task._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-lg shadow-md"
                    >
                        {editingTask === task._id ? (
                            <EditForm
                                task={task}
                                onSave={(updatedTask) => {
                                    handleEdit(task._id, updatedTask);
                                    setEditingTask(null);
                                }}
                                onCancel={() => setEditingTask(null)}
                            />
                        ) : (
                            <>
                                {/* Task Details */}
                                <div className="flex-1 text-left">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {task.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {task.description}
                                    </p>
                                </div>
    
                                {/* Buttons Section */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-4 sm:mt-0">
                                    {/* Status Button */}
                                    <div className="relative group">
                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    task._id,
                                                    task.status === "pending" ? "completed" : "pending"
                                                )
                                            }
                                            className={`px-4 py-2 font-semibold text-sm font-medium rounded-md shadow-md transition duration-200 focus:outline-none focus:ring-2 ${
                                                task.status === "pending"
                                                    ? "text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:ring-yellow-400"
                                                    : "text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-400"
                                            }`}
                                        >
                                            {task.status === "pending" ? "Pending" : "Completed"}
                                        </button>
                                        {/* Tooltip */}
                                        <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs font-semibold rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            Update status
                                        </span>
                                    </div>
    
                                    {/* Edit Button */}
                                    <button
                                        onClick={() => setEditingTask(task._id)}
                                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 mt-2 sm:mt-0"
                                    >
                                        Edit
                                    </button>
    
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(task._id)}
                                        className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 mt-2 sm:mt-0"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
    
};

const EditForm = ({ task, onSave, onCancel }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call the onSave function with updated data
            await onSave({ title, description });
        } catch (error) {
            console.error("Error saving task:", error);
        }
    };

    

    return (
        <div className="flex flex-col items-center space-y-6 p-6 m-4 border border-gray-200 rounded-lg shadow-md ml-6 w-full">
            <h2 className="text-2xl font-semibold">Edit Task</h2>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 text-sm sm:text-base sm:px-6 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 text-sm sm:text-base sm:px-6 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                />
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="px-6 py-3 text-sm sm:text-base font-medium text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 text-sm sm:text-base font-medium text-white bg-gray-500 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 "
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
    

};


export default TaskList;
