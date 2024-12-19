import React from 'react';
import TaskList from './components/TaskList';
import './styles/App.css';
import TaskForm from './components/TaskForm';
import Form from './components/Form';


function App() {
    return (
        <div className="App bg-slate-300" >
            
            <h1 className='text-5xl font-extrabold dark:text-black underline  italic'>To-Do</h1>
            
            <TaskForm/>
            <TaskList />
            
            {/* <Form/> */}
            
        </div>
    );
}

export default App;
