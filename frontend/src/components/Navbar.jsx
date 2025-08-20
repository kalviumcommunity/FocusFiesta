import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaChartBar, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ onAddTask }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">FocusFiesta</h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/stats"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <FaChartBar />
              Stats
            </Link>
          </div>

          {/* User Menu and Actions */}
          <div className="flex items-center space-x-4">
            {/* Add Task Button */}
            <button
              onClick={onAddTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <FaPlus />
              Add Task
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <FaUser className="text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.name || 'User'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <FaSignOutAlt />
              <span className="hidden sm:block">Logout</span>
                </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
