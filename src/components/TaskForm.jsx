import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/tasks', { title, description });
            onTaskAdded(response.data);
            setTitle('');
            setDescription('');
            
            // alert("Task added successfully.");
        } catch (error) {
            console.error('Error adding task:', error);
            
        }
        alert("Task added successfully.");
    };

    return (
        <div>
        <form onSubmit={handleSubmit} >

            <div className="flex flex-col items-center space-y-4  mt-10 mb-10">
            <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-1/2 px-4 py-2 text-sm sm:text-base sm:px-6 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                />
                
            <textarea
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-1/2 px-4 py-2 text-sm sm:text-base sm:px-6 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            />
            <button 
                type="submit"
                className="px-6 py-3 text-sm sm:text-base font-medium text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition duration-200"
            >
                Add Task</button>
            </div>
        </form>
        </div>
    );
};

export default TaskForm;
