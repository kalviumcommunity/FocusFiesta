import React, { useState, useEffect } from 'react';

export default function TaskForm({ task = null, onSubmit, onCancel, isOpen }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    estimatedPomodoros: 1,
    addToGoogleCalendar: false
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        estimatedPomodoros: task.estimatedPomodoros || 1,
        addToGoogleCalendar: false
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      estimatedPomodoros: parseInt(formData.estimatedPomodoros)
    };
    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {task ? 'Edit Task' : 'Add New Task'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Enter task description (optional)"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="estimatedPomodoros" className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Pomodoros
            </label>
            <input
              type="number"
              id="estimatedPomodoros"
              name="estimatedPomodoros"
              value={formData.estimatedPomodoros}
              onChange={handleChange}
              min="1"
              max="20"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <input
                id="addToGoogleCalendar"
                name="addToGoogleCalendar"
                type="checkbox"
                checked={formData.addToGoogleCalendar}
                onChange={handleCheckbox}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="addToGoogleCalendar" className="text-sm text-gray-700">
                Add to Google Calendar
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
                window.open(`${backendUrl}/auth/google/calendar`, '_blank');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
              title="Connect Google Calendar"
            >
              Connect Google Calendar
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
