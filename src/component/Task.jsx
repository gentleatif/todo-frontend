import React, { useState, useEffect } from 'react';
import './Task.css';
import axios from 'axios';

const baseURL = 'http://localhost:3001';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get(`${baseURL}/getAllTask`).then((response) => {
      console.log('getAllTask==>', response.data);
      setTasks(response.data);
    });
  };

  const handleCreateTask = () => {
    axios.post(`${baseURL}/addTask`, { title: newTask }).then(() => {
      fetchTasks();
    });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(tasks[index].title);
  };

  const handleSaveEdit = (index, newTitle) => {
    if (newTitle.trim()) {
      axios
        .put(`${baseURL}/updateTaskById?id=${tasks[index]._id}`, {
          title: newTitle,
        })
        .then(() => {
          setEditIndex(-1);
          setEditValue('');
          fetchTasks();
        });
    }
  };

  const handleDelete = (index) => {
    axios
      .delete(`${baseURL}/deleteTaskById?id=${tasks[index]._id}`)
      .then(() => {
        fetchTasks();
      });
  };

  const handleCheckboxChange = (index, status) => {
    console.log('update task', index);
    axios
      .put(`${baseURL}/updateTaskById?id=${tasks[index]._id}`, {
        status: !status,
        title: tasks[index].title,
      })
      .then(() => {
        fetchTasks();
      });
  };

  return (
    <div>
      <section className='tasks'>
        <header className='tasks-header'>
          <h2 className='tasks-title'>Tasks</h2>
        </header>
        <fieldset className='tasks-list'>
          {tasks.map((task, index) => (
            <label key={index} className='tasks-list-item'>
              <input
                type='checkbox'
                name={`task_${index}`}
                value={task.title}
                style={{ backgroundColor: 'red !important' }}
                className='tasks-list-cb'
                checked={task.status}
                onChange={() => handleCheckboxChange(index, task.status)}
              />
              <span className='tasks-list-mark'></span>
              <span className='tasks-list-desc'>
                {editIndex === index ? (
                  <input
                    type='text'
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSaveEdit(index, editValue)}
                  />
                ) : (
                  task.title
                )}
              </span>
              <button onClick={() => handleEdit(index)}>Edit</button>
              <button onClick={() => handleDelete(index)}>Delete</button>
            </label>
          ))}
        </fieldset>
      </section>
      <div>
        <input
          className='addNewTask'
          type='text'
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder='Add new task'
        />
        <button onClick={handleCreateTask}>Add Task</button>
      </div>
    </div>
  );
};

export default Task;
