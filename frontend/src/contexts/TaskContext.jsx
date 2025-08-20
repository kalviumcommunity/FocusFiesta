import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get('/tasks');
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      setError(null);
      const response = await API.post('/tasks', taskData);
      if (response.data.success) {
        setTasks(prev => [response.data.data, ...prev]);
        return { success: true, task: response.data.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      setError(message);
      return { success: false, message };
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      setError(null);
      const response = await API.put(`/tasks/${taskId}`, updates);
      if (response.data.success) {
        setTasks(prev => 
          prev.map(task => 
            task._id === taskId ? response.data.data : task
          )
        );
        return { success: true, task: response.data.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      setError(message);
      return { success: false, message };
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setError(null);
      const response = await API.delete(`/tasks/${taskId}`);
      if (response.data.success) {
        setTasks(prev => prev.filter(task => task._id !== taskId));
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      setError(message);
      return { success: false, message };
    }
  };

  const toggleTaskCompletion = async (taskId, isCompleted) => {
    return await updateTask(taskId, { isCompleted });
  };

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
