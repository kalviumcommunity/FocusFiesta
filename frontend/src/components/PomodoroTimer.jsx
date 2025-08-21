import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { logSession } from '../api/sessions';
import { useTasks } from '../contexts/TaskContext';
import './PomodoroTimer.css';

const notificationSound = new Audio('/public/notification.mp3');

export default function PomodoroTimer({ onComplete, initialMinutes = 25, breakMinutes = 5, taskId, taskTitle }) {
  const { fetchTasks } = useTasks();
  
  // Timer state variables
  const [workDuration, setWorkDuration] = useState(initialMinutes);
  const [breakDuration, setBreakDuration] = useState(breakMinutes);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  
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
    setIsRunning(true);
    if (!isBreak) {
      setSessionDuration(0); // Reset session duration for new focus session
    }
  }, [isBreak]);

  const handleStop = useCallback(() => setIsRunning(false), []);
  
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setMinutes(workDuration);
    setSeconds(0);
    setSessionDuration(0);
  }, [workDuration]);

  const handleMiniModeToggle = useCallback(() => {
    setIsMiniMode(false);
  }, []);

  const handleNotificationClose = useCallback(() => {
    setShowMiniModeNotification(false);
  }, []);

  // Update current timer when user changes durations while paused
  const onChangeWorkDuration = useCallback((value) => {
    const safe = Math.max(1, Number(value) || 1);
    setWorkDuration(safe);
    if (!isRunning && !isBreak) {
      setMinutes(safe);
      setSeconds(0);
    }
  }, [isRunning, isBreak]);

  const onChangeBreakDuration = useCallback((value) => {
    const safe = Math.max(1, Number(value) || 1);
    setBreakDuration(safe);
    if (!isRunning && isBreak) {
      setMinutes(safe);
      setSeconds(0);
    }
  }, [isRunning, isBreak]);

  // Auto-switch to mini mode when timer starts
  // This provides a seamless user experience by automatically minimizing the timer
  // when it's running, allowing users to continue working while keeping track of time
  useEffect(() => {
    if (isRunning && !isMiniMode) {
      // Immediate switch to mini mode for responsive feel
      setIsMiniMode(true);
      setShowMiniModeNotification(true);
      // Hide notification after 3 seconds to avoid cluttering the UI
      setTimeout(() => setShowMiniModeNotification(false), 3000);
    } else if (!isRunning && isMiniMode) {
      // Small delay to allow for smooth transition back to full mode
      // This ensures the mini timer doesn't disappear abruptly
      const timer = setTimeout(() => {
        setIsMiniMode(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isRunning, isMiniMode]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          if (!isBreak) {
            // Focus session completed - log it to backend
            if (taskId) {
              logSessionToBackend();
            }
            notificationSound.play(); // Play sound notification
            setIsBreak(true);
            setMinutes(breakDuration);
            setSeconds(0);
            onComplete && onComplete();
          } else {
            // Break completed
            notificationSound.play(); // Play sound notification
            setIsBreak(false);
            setMinutes(workDuration);
            setSeconds(0);
          }
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, minutes, seconds, isBreak, workDuration, breakDuration, onComplete, taskId]);

  // Track session duration
  useEffect(() => {
    if (isRunning && !isBreak) {
      const interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, isBreak]);

  const logSessionToBackend = async () => {
    try {
      if (!taskId) {
        console.error('No task ID provided');
        return;
      }

      await logSession(taskId, sessionDuration);
      // Refresh tasks so completedPomodoros updates in UI
      if (fetchTasks) {
        fetchTasks();
      }
      console.log('Session logged successfully');
    } catch (error) {
      console.error('Error logging session:', error);
    }
  };

  // Memoize the MiniTimer component to prevent re-creation
  const MiniTimer = useMemo(() => (
    <div className="pomodoro-mini-timer">
      {/* Header with session type and task info - Clickable to return to full view */}
      <div 
        className="flex items-center justify-between mb-2 cursor-pointer hover:bg-gray-50 rounded p-1 transition-colors group"
        onClick={handleMiniModeToggle}
        title="Click to return to full view"
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
        {/* Animated progress indicator - shows timer is active */}
        <div className="w-3 h-3 rounded-full bg-blue-500 pomodoro-pulse"></div>
        {/* Subtle hint that header is clickable */}
        <div className="ml-2 text-xs text-gray-400 group-hover:text-blue-400 transition-colors">
          ↖
        </div>
      </div>

      {/* Compact timer display - large enough to read easily */}
      <div className="text-2xl font-bold text-gray-800 text-center mb-2">
        {formatTime(minutes, seconds)}
      </div>

      {/* Mini progress bar - shows completion percentage */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
        <div 
          className="bg-blue-600 h-1.5 rounded-full pomodoro-progress-bar"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      {/* Essential controls - Start/Pause and Reset buttons */}
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

  // Memoize the FullTimer component to prevent re-creation
  const FullTimer = useMemo(() => (
    <div className="pomodoro-full-timer flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {isBreak ? 'Break Time' : 'Focus Session'}
        </h3>
        {taskTitle && (
          <p className="text-sm text-gray-600">Task: {taskTitle}</p>
        )}
      </div>

      {/* Duration settings - allows users to customize work and break times */}
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

      {/* Progress Bar - visual representation of session completion */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-600 h-2 rounded-full pomodoro-progress-bar"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      {/* Large timer display - easy to read from a distance */}
      <div className="text-4xl font-bold text-gray-800 mb-6">
        {formatTime(minutes, seconds)}
      </div>

      {/* Session duration tracking - shows how long the current session has been running */}
      {isRunning && !isBreak && (
        <div className="text-sm text-gray-600 mb-4">
          Session duration: {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
        </div>
      )}

      {/* Timer controls - Start/Pause and Reset buttons */}
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

      {/* Motivational status message */}
      <div className="mt-4 text-sm text-gray-500">
        {isBreak ? 'Take a break and relax!' : 'Stay focused and productive!'}
      </div>
    </div>
  ), [isBreak, taskTitle, workDuration, breakDuration, getProgressPercentage, minutes, seconds, isRunning, sessionDuration, handleStart, handleStop, handleReset, formatTime, onChangeWorkDuration, onChangeBreakDuration]);

  // Main render method - conditionally renders components based on state
  return (
    <div className="pomodoro-timer-container">
      {/* Mini mode notification - appears when timer switches to mini mode */}
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
      
      {/* Render mini timer when in mini mode - fixed positioning for always-visible access */}
      {isMiniMode && MiniTimer}
      
      {/* Render full timer only when NOT in mini mode - prevents duplicate rendering */}
      {!isMiniMode && FullTimer}
    </div>
  );
}
