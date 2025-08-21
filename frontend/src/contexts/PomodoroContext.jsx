import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { logSession } from '../api/sessions';

const PomodoroContext = createContext(null);

const notificationSound = typeof Audio !== 'undefined' ? new Audio('/notification.mp3') : null;

if (notificationSound) {
  notificationSound.addEventListener('error', (e) => {
    // Non-fatal; just log
    // eslint-disable-next-line no-console
    console.warn('Notification sound could not be loaded:', e);
  });
}

const playNotification = () => {
  try {
    if (!notificationSound) return;
    notificationSound.play().catch(err => {
      // eslint-disable-next-line no-console
      console.warn('Could not play notification sound:', err);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Error playing notification sound:', err);
  }
};

export const PomodoroProvider = ({ children }) => {
  // Durations in minutes
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  // Current countdown
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  // State
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0); // seconds spent in current focus session

  // Task association (optional)
  const [currentTask, setCurrentTask] = useState(null); // { _id, title }

  // Track whether the full PomodoroTimer UI is mounted (to decide when to show a global mini-timer)
  const [isTimerMounted, setIsTimerMounted] = useState(false);

  // onComplete callback reference (set at start)
  const onCompleteRef = useRef(null);

  // Public API helpers
  const updateWorkDuration = (value) => {
    const safe = Math.max(1, Number(value) || 1);
    setWorkDuration(safe);
    if (!isRunning && !isBreak) {
      setMinutes(safe);
      setSeconds(0);
    }
  };

  const updateBreakDuration = (value) => {
    const safe = Math.max(1, Number(value) || 1);
    setBreakDuration(safe);
    if (!isRunning && isBreak) {
      setMinutes(safe);
      setSeconds(0);
    }
  };

  const selectTask = (task) => {
    setCurrentTask(task || null);
    if (task && task._id) {
      // Reset timer when switching tasks (matches previous behavior)
      setIsRunning(false);
      setIsBreak(false);
      setMinutes(workDuration);
      setSeconds(0);
      setSessionDuration(0);
    }
  };

  const start = ({ task, onComplete } = {}) => {
    if (task) {
      selectTask(task);
    }
    onCompleteRef.current = typeof onComplete === 'function' ? onComplete : null;
    setIsRunning(true);
    if (!isBreak) {
      setSessionDuration(0);
    }
  };

  const stop = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setMinutes(workDuration);
    setSeconds(0);
    setSessionDuration(0);
  };

  // Main timer tick
  useEffect(() => {
    let timerId;
    if (isRunning) {
      timerId = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          }
          // prevSeconds == 0
          return 0;
        });
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning]);

  // Handle minute/second borrow and phase transitions
  useEffect(() => {
    if (!isRunning) return;

    if (seconds === 0) {
      if (minutes > 0) {
        setMinutes((m) => (m > 0 ? m - 1 : 0));
        if (minutes > 0) {
          setSeconds(59);
        }
        return;
      }

      // minutes === 0 and seconds === 0 -> phase end
      if (!isBreak) {
        // Log focus session if a task is selected
        const taskId = currentTask?._id;
        if (taskId) {
          (async () => {
            try {
              await logSession(taskId, sessionDuration);
              // Notify other parts of the app (e.g., TaskContext) to refresh tasks
              if (typeof window !== 'undefined' && window.dispatchEvent) {
                window.dispatchEvent(new CustomEvent('pomodoro:sessionLogged', { detail: { taskId } }));
              }
              // eslint-disable-next-line no-console
              console.log('Session logged successfully');
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('Error logging session:', error);
            }
          })();
        }
        playNotification();
        setIsBreak(true);
        setMinutes(breakDuration);
        setSeconds(0);
        if (onCompleteRef.current) {
          try { onCompleteRef.current(); } catch (_) {}
        }
      } else {
        // Break completed -> back to focus
        playNotification();
        setIsBreak(false);
        setMinutes(workDuration);
        setSeconds(0);
      }
    }
  }, [seconds, minutes, isRunning, isBreak, workDuration, breakDuration, currentTask, sessionDuration]);

  // Track session duration only during focus and when running
  useEffect(() => {
    if (isRunning && !isBreak) {
      const id = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(id);
    }
  }, [isRunning, isBreak]);

  const value = useMemo(() => ({
    // state
    minutes,
    seconds,
    isRunning,
    isBreak,
    workDuration,
    breakDuration,
    sessionDuration,
    currentTask,
    isTimerMounted,
    // actions
    start,
    stop,
    reset,
    updateWorkDuration,
    updateBreakDuration,
    selectTask,
    setIsTimerMounted,
  }), [minutes, seconds, isRunning, isBreak, workDuration, breakDuration, sessionDuration, currentTask]);

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const ctx = useContext(PomodoroContext);
  if (!ctx) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return ctx;
};

export { PomodoroContext };


