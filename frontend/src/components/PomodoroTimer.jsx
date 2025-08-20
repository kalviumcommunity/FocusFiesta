import React, { useState, useEffect } from 'react';
import { logSession } from '../api/sessions';
import { useTasks } from '../contexts/TaskContext';

const notificationSound = new Audio('/public/notification.mp3');

export default function PomodoroTimer({ onComplete, initialMinutes = 25, breakMinutes = 5, taskId, taskTitle }) {
  const { fetchTasks } = useTasks();
  // Allow user to adjust durations
  const [workDuration, setWorkDuration] = useState(initialMinutes);
  const [breakDuration, setBreakDuration] = useState(breakMinutes);

  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);

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

  const handleStart = () => {
    setIsRunning(true);
    if (!isBreak) {
      setSessionDuration(0); // Reset session duration for new focus session
    }
  };

  const handleStop = () => setIsRunning(false);
  
  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setMinutes(workDuration);
    setSeconds(0);
    setSessionDuration(0);
  };

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalSeconds = (isBreak ? breakDuration : workDuration) * 60;
    const remainingSeconds = minutes * 60 + seconds;
    return totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
  };

  // Update current timer when user changes durations while paused
  const onChangeWorkDuration = (value) => {
    const safe = Math.max(1, Number(value) || 1);
    setWorkDuration(safe);
    if (!isRunning && !isBreak) {
      setMinutes(safe);
      setSeconds(0);
    }
  };

  const onChangeBreakDuration = (value) => {
    const safe = Math.max(1, Number(value) || 1);
    setBreakDuration(safe);
    if (!isRunning && isBreak) {
      setMinutes(safe);
      setSeconds(0);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {isBreak ? 'Break Time' : 'Focus Session'}
        </h3>
        {taskTitle && (
          <p className="text-sm text-gray-600">Task: {taskTitle}</p>
        )}
      </div>

      {/* Settings */}
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

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      {/* Timer Display */}
      <div className="text-4xl font-bold text-gray-800 mb-6">
        {formatTime(minutes, seconds)}
      </div>

      {/* Session Info */}
      {isRunning && !isBreak && (
        <div className="text-sm text-gray-600 mb-4">
          Session duration: {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
        </div>
      )}

      {/* Controls */}
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

      {/* Status */}
      <div className="mt-4 text-sm text-gray-500">
        {isBreak ? 'Take a break and relax!' : 'Stay focused and productive!'}
      </div>
    </div>
  );
}
