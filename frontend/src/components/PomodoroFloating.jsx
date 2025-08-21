import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePomodoro } from '../contexts/PomodoroContext.jsx';
import './PomodoroTimer.css';

export default function PomodoroFloating() {
  const {
    isRunning,
    isBreak,
    minutes,
    seconds,
    isTimerMounted,
    currentTask,
    workDuration,
    breakDuration,
    start,
    stop,
    reset,
  } = usePomodoro();

  const navigate = useNavigate();

  const formatTime = useCallback((mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getProgressPercentage = useCallback(() => {
    const totalSeconds = (isBreak ? breakDuration : workDuration) * 60;
    const remainingSeconds = minutes * 60 + seconds;
    return totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
  }, [isBreak, breakDuration, workDuration, minutes, seconds]);

  if (!currentTask || isTimerMounted) return null;

  const taskTitle = currentTask?.title;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <div className="pomodoro-mini-timer">
        <div className="flex items-center justify-between mb-2 rounded p-1 cursor-pointer hover:bg-gray-50 transition-colors"
             title="Go to full view"
             onClick={() => navigate('/dashboard?full=1')}
        >
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-700 truncate">
              {isBreak ? 'Break' : 'Focus'}
            </div>
            {taskTitle && (
              <div className="text-xs text-gray-500 truncate max-w-[150px]">
                {taskTitle}
              </div>
            )}
          </div>
          <div className="w-3 h-3 rounded-full bg-blue-500 pomodoro-pulse"></div>
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
            onClick={() => (isRunning ? stop() : start())}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          
          <button 
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
            onClick={() => reset()}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}


