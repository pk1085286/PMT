import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newTask, setNewTask] = useState({ name: '', description: '', dueDate: '', assignedTo: '', project: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3000/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => setUser(res.data))
        .catch(err => console.log(err));
    }
  }, []);

  const handleSignUp = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/signup', {
      email: event.target.email.value,
      password: event.target.password.value
    })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        setUser({ email: event.target.email.value });
      })
      .catch(err => console.log(err));
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/signin', {
      email: event.target.email.value,
      password: event.target.password.value
    })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        setUser({ email: event.target.email.value });
      })
      .catch(err => console.log(err));
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleCreateProject = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/projects', newProject, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token
