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
    <div className={`task-card-enhanced hover-lift ${
      task.isCompleted ? 'completed' : ''
    } ${isOverdue ? 'overdue' : ''}`}>
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className={`heading-enhanced text-lg truncate pr-3 ${
          task.isCompleted ? 'line-through text-gray-500' : ''
        }`}>
          {task.title}
        </h3>
        <div className="flex items-center gap-2">
          {task.isCompleted && (
            <span className="status-badge completed">Completed</span>
          )}
          {isOverdue && (
            <span className="status-badge overdue">Overdue</span>
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
            {task.completedPomodoros || 0}/{task.estimatedPomodoros ? task.estimatedPomodoros : 'Not set'} Pomodoros
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {!task.isCompleted && (
          <button
            onClick={onStartTimer}
            className="btn-primary-enhanced px-3 py-1.5 text-sm inline-flex items-center justify-center gap-2"
          >
            <FaPlay className="text-sm" />
            Start Timer
          </button>
        )}
        
        <button
          onClick={() => onToggleComplete(task._id, !task.isCompleted)}
          className={`px-3 py-1.5 text-sm font-medium inline-flex items-center justify-center gap-2 ${
            task.isCompleted
              ? 'btn-secondary-enhanced'
              : 'btn-success-enhanced'
          }`}
        >
          <FaCheck className="text-sm" />
          {task.isCompleted ? 'Undo' : 'Complete'}
        </button>
        
        <button
          onClick={onEdit}
          className="btn-warning-enhanced px-3 py-1.5 text-sm font-medium inline-flex items-center justify-center gap-2"
        >
          <FaEdit className="text-sm" />
          Edit
        </button>
        
        <button
          onClick={onDelete}
          className="btn-danger-enhanced px-3 py-1.5 text-sm font-medium inline-flex items-center justify-center gap-2"
        >
          <FaTrash className="text-sm" />
          Delete
        </button>
      </div>
    </div>
  );
}
