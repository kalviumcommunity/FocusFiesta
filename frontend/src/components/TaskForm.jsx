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
    
    // Ensure estimatedPomodoros is a valid positive number
    const pomodoros = parseInt(formData.estimatedPomodoros);
    const validPomodoros = pomodoros > 0 ? pomodoros : undefined;
    
    const submitData = {
      ...formData,
      estimatedPomodoros: validPomodoros
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
    <div className="modal-backdrop-enhanced">
      <div className="form-container-enhanced p-8 max-w-md w-full mx-4">
        <h2 className="heading-enhanced text-2xl mb-6">
          {task ? 'Edit Task' : 'Add New Task'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="form-label">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input-enhanced"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="input-enhanced resize-none"
              placeholder="Enter task description (optional)"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="form-label">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="input-enhanced"
            />
          </div>

          <div>
            <label htmlFor="estimatedPomodoros" className="form-label">
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
              className="input-enhanced"
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
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
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
              className="text-sm text-blue-600 hover:text-blue-700 underline transition-colors duration-200"
              title="Connect Google Calendar"
            >
              Connect Google Calendar
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn-primary-enhanced flex-1 py-3 px-6"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary-enhanced flex-1 py-3 px-6"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
