import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaChartBar, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import FocusFiestaLogo from '../assets/FocusFiestaRemovedBG.png';

export default function Navbar({ onAddTask }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar-enhanced">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center group">
              <div className="w-16 h-16 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                <img 
                  src={FocusFiestaLogo} 
                  alt="FocusFiesta Logo" 
                  className="w-78 h-78 object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="nav-link-enhanced"
            >
              Dashboard
            </Link>
            <Link
              to="/stats"
              className="nav-link-enhanced flex items-center gap-2"
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
              className="btn-primary-enhanced px-4 py-2 flex items-center gap-2"
            >
              <FaPlus />
              Add Task
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110">
                <FaUser className="text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.name || 'User'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="nav-link-enhanced flex items-center gap-2 hover:text-red-600"
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
