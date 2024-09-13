import React, { useState, useEffect } from 'react';
import './ToDo.css';

function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim() && dueDate) {
      setTasks([...tasks, { text: input, dueDate, completed: false, priority }]);
      setInput('');
      setDueDate('');
      setPriority('Medium');
    }
  };

  const toggleTaskCompletion = index => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const deleteTask = index => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const startEdit = (index, text, date, priority) => {
    setEditIndex(index);
    setEditText(text);
    setEditDate(date);
    setEditPriority(priority);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      const newTasks = [...tasks];
      newTasks[editIndex] = { text: editText, dueDate: editDate, completed: newTasks[editIndex].completed, priority: editPriority };
      setTasks(newTasks);
      setEditIndex(null);
      setEditText('');
      setEditDate('');
      setEditPriority('Medium');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const getProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const checkDueDate = dueDate => {
    const today = new Date().toISOString().split('T')[0];
    if (dueDate < today) {
      return 'overdue';
    } else if (dueDate === today) {
      return 'due-today';
    } else {
      return '';
    }
  };

  return (
    <div className={`todo-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="theme-toggle">
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider round"></span>
        </label>
      </div>
      <h1>To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new task"
        />
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="filter-container">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
      </div>
      <div className="progress-container">
        <progress value={getProgress()} max="100"></progress>
        <span>{getProgress()}% Completed</span>
      </div>
      <ul>
        {filteredTasks.map((task, index) => (
          <li key={index} className={`task ${task.completed ? 'completed' : ''} ${checkDueDate(task.dueDate)} priority-${task.priority.toLowerCase()}`}>
            {editIndex === index ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
                <input
                  type="date"
                  value={editDate}
                  onChange={e => setEditDate(e.target.value)}
                />
                <select
                  value={editPriority}
                  onChange={e => setEditPriority(e.target.value)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button onClick={saveEdit}>Save</button>
              </div>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(index)}
                />
                <span onClick={() => toggleTaskCompletion(index)}>{task.text}</span>
                <span className="due-date">{task.dueDate}</span>
                <button onClick={() => startEdit(index, task.text, task.dueDate, task.priority)}>Edit</button>
                <button onClick={() => deleteTask(index)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDo;