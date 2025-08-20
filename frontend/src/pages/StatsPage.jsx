import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import Navbar from '../components/Navbar';
import { FaClock, FaCheckCircle, FaFire, FaCalendarAlt, FaTrophy } from 'react-icons/fa';
import API from '../api/api';

export default function StatsPage() {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [stats, setStats] = useState({
    daily: { sessions: 0, totalDuration: 0 },
    weekly: { sessions: 0, totalDuration: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get('/sessions/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const calculateTaskStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return { totalTasks, completedTasks, pendingTasks, completionRate };
  };

  const taskStats = calculateTaskStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Your Productivity Stats 📊
          </h1>
          <p className="text-gray-600 text-lg">
            Track your progress and stay motivated
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tasks */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaCheckCircle className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{taskStats.totalTasks}</h3>
            <p className="text-gray-600">Total Tasks</p>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaTrophy className="text-green-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{taskStats.completedTasks}</h3>
            <p className="text-gray-600">Completed</p>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaFire className="text-purple-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{taskStats.completionRate}%</h3>
            <p className="text-gray-600">Success Rate</p>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaClock className="text-orange-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{taskStats.pendingTasks}</h3>
            <p className="text-gray-600">Pending</p>
          </div>
        </div>

        {/* Focus Sessions Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Today's Focus</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Focus Sessions:</span>
                <span className="font-semibold text-gray-800">{stats.daily.sessions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Focus Time:</span>
                <span className="font-semibold text-gray-800">{formatDuration(stats.daily.totalDuration)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Session:</span>
                <span className="font-semibold text-gray-800">
                  {stats.daily.sessions > 0 
                    ? formatDuration(Math.round(stats.daily.totalDuration / stats.daily.sessions))
                    : '0m'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Weekly Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">This Week's Focus</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Focus Sessions:</span>
                <span className="font-semibold text-gray-800">{stats.weekly.sessions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Focus Time:</span>
                <span className="font-semibold text-gray-800">{formatDuration(stats.weekly.totalDuration)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Session:</span>
                <span className="font-semibold text-gray-800">
                  {stats.weekly.sessions > 0 
                    ? formatDuration(Math.round(stats.weekly.totalDuration / stats.weekly.sessions))
                    : '0m'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Productivity Insights */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Productivity Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Task Completion</h4>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${taskStats.completionRate}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {taskStats.completedTasks} of {taskStats.totalTasks} tasks completed
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Daily Progress</h4>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {stats.daily.sessions > 0 ? '🎯' : '😴'}
              </div>
              <p className="text-sm text-gray-600">
                {stats.daily.sessions > 0 
                  ? `Great job! You completed ${stats.daily.sessions} focus sessions today.`
                  : "No focus sessions yet today. Time to get started!"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
