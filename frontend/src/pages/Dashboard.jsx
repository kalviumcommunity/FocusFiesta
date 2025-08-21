import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import PomodoroTimer from '../components/PomodoroTimer';
import { FaPlus, FaClock, FaCheckCircle } from 'react-icons/fa';

export default function Dashboard() {
  const { user, handleGoogleOAuthRedirect } = useAuth();
  const { 
    tasks, 
    loading, 
    error, 
    createTask, 
    updateTask, 
    deleteTask, 
    toggleTaskCompletion 
  } = useTasks();

  // Handle Google OAuth redirect to dashboard
  useEffect(() => {
    // Check if we're coming from Google OAuth
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error')) {
      // If there's an error, redirect to login
      window.location.href = '/login?error=oauth_failed';
    }
  }, []);
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleSubmitTask = async (taskData) => {
    if (editingTask) {
      const result = await updateTask(editingTask._id, taskData);
      if (result.success) {
        setShowTaskForm(false);
        setEditingTask(null);
      }
    } else {
      const result = await createTask(taskData);
      if (result.success) {
        setShowTaskForm(false);
      }
    }
  };

  const handleDeleteTask = async (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      await deleteTask(task._id);
    }
  };

  const handleToggleComplete = async (taskId, isCompleted) => {
    await toggleTaskCompletion(taskId, isCompleted);
  };

  const handleStartTimer = (task) => {
    setSelectedTask(task);
  };

  const handleTimerComplete = () => {
    // Timer completed, could update task progress here
    setSelectedTask(null);
  };

  // Filter tasks
  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  if (loading) {
    return (
      <div className="min-h-screen enhanced-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen enhanced-bg">
      <Navbar onAddTask={handleAddTask} />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Header */}
        <div className="welcome-header">
          <h1 className="heading-enhanced text-3xl text-gray-800 mb-2">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Let's focus on what matters most today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stats-card-enhanced text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
              <FaClock className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{pendingTasks.length}</h3>
            <p className="text-gray-600">Pending Tasks</p>
          </div>
          
          <div className="stats-card-enhanced text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{completedTasks.length}</h3>
            <p className="text-gray-600">Completed Tasks</p>
          </div>
          
          <div className="stats-card-enhanced text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
              <FaPlus className="text-purple-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{tasks.length}</h3>
            <p className="text-gray-600">Total Tasks</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Task Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Tasks */}
          <div>
            <div className="task-section-header">
              <div className="icon-container bg-blue-100">
                <FaClock className="text-blue-600 text-lg" />
              </div>
              <h2 className="heading-enhanced text-2xl text-gray-800">
                Pending Tasks ({pendingTasks.length})
              </h2>
            </div>
            
            {pendingTasks.length === 0 ? (
              <div className="empty-state">
                <div className="icon-container">
                  <FaPlus className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No pending tasks</h3>
                <p className="text-gray-500 mb-4">Start by adding your first task!</p>
                <button
                  onClick={handleAddTask}
                  className="btn-primary-enhanced px-6 py-2"
                >
                  Add Your First Task
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStartTimer={handleStartTimer}
                    onEdit={() => handleEditTask(task)}
                    onDelete={() => handleDeleteTask(task)}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Completed Tasks */}
          <div>
            <div className="task-section-header">
              <div className="icon-container bg-green-100">
                <FaCheckCircle className="text-green-600 text-lg" />
              </div>
              <h2 className="heading-enhanced text-2xl text-gray-800">
                Completed Tasks ({completedTasks.length})
              </h2>
            </div>
            
            {completedTasks.length === 0 ? (
              <div className="empty-state">
                <div className="icon-container">
                  <FaCheckCircle className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No completed tasks yet</h3>
                <p className="text-gray-500">Complete your first task to see it here!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStartTimer={handleStartTimer}
                    onEdit={() => handleEditTask(task)}
                    onDelete={() => handleDeleteTask(task)}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pomodoro Timer */}
        {selectedTask && (
          <div className="fixed bottom-6 right-6 z-40">
            <PomodoroTimer
              task={selectedTask}
              onComplete={handleTimerComplete}
            />
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmitTask}
          onCancel={() => setShowTaskForm(false)}
          isOpen={showTaskForm}
        />
      )}

      {/* Floating Action Button */}
      <button
        onClick={handleAddTask}
        className="fab"
        title="Add New Task"
      >
        <FaPlus className="text-xl" />
      </button>
    </div>
  );
}
