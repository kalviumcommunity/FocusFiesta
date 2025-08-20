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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar onAddTask={handleAddTask} />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Ready to focus and get things done?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaClock className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{pendingTasks.length}</h3>
            <p className="text-gray-600">Pending Tasks</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{completedTasks.length}</h3>
            <p className="text-gray-600">Completed Tasks</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaPlus className="text-purple-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{tasks.length}</h3>
            <p className="text-gray-600">Total Tasks</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Tasks Section */}
        <div className="space-y-8">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaClock className="text-blue-500" />
                Pending Tasks ({pendingTasks.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStartTimer={() => handleStartTimer(task)}
                    onEdit={() => handleEditTask(task)}
                    onDelete={() => handleDeleteTask(task)}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Completed Tasks ({completedTasks.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStartTimer={() => handleStartTimer(task)}
                    onEdit={() => handleEditTask(task)}
                    onDelete={() => handleDeleteTask(task)}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {tasks.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPlus className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks yet</h3>
              <p className="text-gray-500 mb-6">Create your first task to get started!</p>
              <button
                onClick={handleAddTask}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Create Your First Task
              </button>
            </div>
          )}
        </div>

        {/* Pomodoro Timer Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Pomodoro Timer
                </h3>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mb-4">Task: {selectedTask.title}</p>
              <PomodoroTimer
                onComplete={handleTimerComplete}
                taskId={selectedTask._id}
                taskTitle={selectedTask.title}
              />
            </div>
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      <TaskForm
        task={editingTask}
        onSubmit={handleSubmitTask}
        onCancel={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        isOpen={showTaskForm}
      />
    </div>
  );
}
