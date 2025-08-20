import React from 'react';
import { FaPlay, FaEdit, FaTrash, FaCheck, FaClock } from 'react-icons/fa';

export default function TaskCard({ task, onStartTimer, onEdit, onDelete, onToggleComplete }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl ${
      task.isCompleted ? 'opacity-75' : ''
    }`}>
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className={`text-lg font-semibold text-gray-800 truncate pr-3 ${
          task.isCompleted ? 'line-through text-gray-500' : ''
        }`}>
          {task.title}
        </h3>
        <div className="flex items-center gap-2">
          {task.isCompleted && (
            <FaCheck className="text-green-500 text-lg" />
          )}
          {isOverdue && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
              Overdue
            </span>
          )}
        </div>
      </div>

      {/* Task Description */}
      {task.description && (
        <p className={`text-gray-600 mb-4 max-h-24 overflow-auto ${
          task.isCompleted ? 'line-through' : ''
        }`}>
          {task.description}
        </p>
      )}

      {/* Task Meta */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaClock className="text-blue-500" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            {task.completedPomodoros || 0}/{task.estimatedPomodoros || '?'} Pomodoros
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {!task.isCompleted && (
          <button
            onClick={onStartTimer}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 inline-flex items-center justify-center gap-2"
          >
            <FaPlay className="text-sm" />
            Start Timer
          </button>
        )}
        
        <button
          onClick={() => onToggleComplete(task._id, !task.isCompleted)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 inline-flex items-center justify-center gap-2 ${
            task.isCompleted
              ? 'bg-gray-300 hover:bg-gray-400 text-gray-700'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <FaCheck className="text-sm" />
          {task.isCompleted ? 'Undo' : 'Complete'}
        </button>
        
        <button
          onClick={onEdit}
          className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm font-medium transition-colors duration-200 inline-flex items-center justify-center gap-2"
        >
          <FaEdit className="text-sm" />
          Edit
        </button>
        
        <button
          onClick={onDelete}
          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors duration-200 inline-flex items-center justify-center gap-2"
        >
          <FaTrash className="text-sm" />
          Delete
        </button>
      </div>
    </div>
  );
}
