import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { usePomodoro } from '../contexts/PomodoroContext.jsx';
import './PomodoroTimer.css';

export default function PomodoroTimer({ onComplete, initialMinutes = 25, breakMinutes = 5, task, onClose }) {
  const {
    minutes,
    seconds,
    isRunning,
    isBreak,
    workDuration,
    breakDuration,
    sessionDuration,
    currentTask,
    isTimerMounted,
    setIsTimerMounted,
    start,
    stop,
    reset,
    updateWorkDuration,
    updateBreakDuration,
    selectTask,
  } = usePomodoro();
  
  // Extract task information
  const taskTitle = task?.title;
  
  // Mini mode state management
  const [isMiniMode, setIsMiniMode] = useState(false);
  const [showMiniModeNotification, setShowMiniModeNotification] = useState(false);

  // Memoize timer functions to prevent unnecessary re-renders
  const formatTime = useCallback((mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getProgressPercentage = useCallback(() => {
    const totalSeconds = (isBreak ? breakDuration : workDuration) * 60;
    const remainingSeconds = minutes * 60 + seconds;
    return totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
  }, [isBreak, breakDuration, workDuration, minutes, seconds]);

  // Memoize handlers to prevent re-creation on every render
  const handleStart = useCallback(() => {
    start({ task, onComplete });
  }, [start, task, onComplete]);

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);
  
  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  // const handleMiniModeToggle = useCallback(() => {
  //   console.log('Mini mode toggle clicked, current isMiniMode:', isMiniMode);
  //   setIsMiniMode(prev => {
  //     console.log('Setting isMiniMode to:', !prev);
  //     return !prev;
  //   });
  // }, [isMiniMode]);

  const handleMiniModeToggle = () => {
    setIsMiniMode(prev => !prev);
  }

  const handleNotificationClose = useCallback(() => {
    setShowMiniModeNotification(false);
  }, []);

  // Update current timer when user changes durations while paused
  const onChangeWorkDuration = useCallback((value) => {
    updateWorkDuration(value);
  }, [updateWorkDuration]);

  const onChangeBreakDuration = useCallback((value) => {
    updateBreakDuration(value);
  }, [updateBreakDuration]);

  // Reset timer when task changes
  useEffect(() => {
    if (task && (!currentTask || currentTask._id !== task._id)) {
      selectTask(task);
      setIsMiniMode(false);
    }
  }, [task, currentTask, selectTask]);

  // Mark this timer UI as mounted/unmounted globally
  useEffect(() => {
    setIsTimerMounted(true);
    return () => setIsTimerMounted(false);
  }, [setIsTimerMounted]);

  // Auto-switch to mini mode only when the timer transitions from paused->running while this component is mounted
  const prevIsRunningRef = useRef(isRunning);
  useEffect(() => {
    const wasRunning = prevIsRunningRef.current;
    prevIsRunningRef.current = isRunning;
    if (!wasRunning && isRunning && !isMiniMode) {
      setIsMiniMode(true);
      setShowMiniModeNotification(true);
      setTimeout(() => setShowMiniModeNotification(false), 3000);
    }
    // Removed the automatic switch back to full mode to allow manual control
  }, [isRunning, isMiniMode]);

  // Timer logic moved to context

  // Memoize the MiniTimer component
  const MiniTimer = useMemo(() => (
    <div className="pomodoro-mini-timer">
      <div 
        className="flex items-center justify-between mb-2 cursor-pointer hover:bg-gray-50 rounded p-1 transition-colors group border border-transparent hover:border-gray-300"
        onClick={() => {
          console.log('Mini timer header clicked!');
          handleMiniModeToggle();
        }}
        title="Click to return to full view"
        style={{ cursor: 'pointer' }}
      >
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-700 truncate group-hover:text-blue-600 transition-colors">
            {isBreak ? 'Break' : 'Focus'}
          </div>
          {taskTitle && (
            <div className="text-xs text-gray-500 truncate max-w-[150px] group-hover:text-blue-500 transition-colors">
              {taskTitle}
            </div>
          )}
        </div>
        <div className="w-3 h-3 rounded-full bg-blue-500 pomodoro-pulse"></div>
        <div className="ml-2 text-xs text-blue-500 group-hover:text-blue-600 transition-colors font-bold">
          ↖ Full View
        </div>
      </div>

      <div className="text-2xl font-bold text-white text-center mb-2" style={{ color: '#ffffff' }}>
        {formatTime(minutes, seconds)}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
        <div 
          className="bg-blue-600 h-1.5 rounded-full pomodoro-progress-bar"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      <div className="flex gap-2">
        <button 
          className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            isRunning 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          onClick={isRunning ? handleStop : handleStart}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button 
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  ), [isBreak, taskTitle, minutes, seconds, getProgressPercentage, isRunning, handleMiniModeToggle, handleStart, handleStop, handleReset, formatTime]);

  // Memoize the FullTimer component
  const FullTimer = useMemo(() => (
    <div className="pomodoro-full-timer flex flex-col items-center p-6 bg-white rounded-lg shadow-md relative">
      {onClose && (
        <button
          type="button"
          aria-label="Close"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
      )}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {isBreak ? 'Break Time' : 'Focus Session'}
        </h3>
        {taskTitle && (
          <p className="text-sm text-gray-600">Task: {taskTitle}</p>
        )}
      </div>

      <div className="w-full grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Work (min)</label>
          <input
            type="number"
            min="1"
            value={workDuration}
            onChange={(e) => onChangeWorkDuration(e.target.value)}
            className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Break (min)</label>
          <input
            type="number"
            min="1"
            value={breakDuration}
            onChange={(e) => onChangeBreakDuration(e.target.value)}
            className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-600 h-2 rounded-full pomodoro-progress-bar"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      <div className="text-4xl font-bold text-gray-800 mb-6">
        {formatTime(minutes, seconds)}
      </div>

      {isRunning && !isBreak && (
        <div className="text-sm text-gray-600 mb-4">
          Session duration: {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
        </div>
      )}

      <div className="flex gap-3">
        <button 
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isRunning 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          onClick={isRunning ? handleStop : handleStart}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button 
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        {isBreak ? 'Take a break and relax!' : 'Stay focused and productive!'}
      </div>
    </div>
  ), [isBreak, taskTitle, workDuration, breakDuration, getProgressPercentage, minutes, seconds, isRunning, sessionDuration, handleStart, handleStop, handleReset, formatTime, onChangeWorkDuration, onChangeBreakDuration, onClose]);

  return (
    <div className="pomodoro-timer-container">
      {showMiniModeNotification && (
        <div className="pomodoro-notification fixed top-4 right-4 z-[9999] bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out animate-bounce">
          <div className="flex items-center gap-2">
            <span className="text-sm">⏱️ Timer minimized to bottom-left</span>
            <button 
              onClick={handleNotificationClose}
              className="text-white hover:text-blue-100 ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {isMiniMode && MiniTimer}
      {!isMiniMode && FullTimer}
    </div>
  );
}
