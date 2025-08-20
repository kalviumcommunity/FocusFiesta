import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    // Check if we're returning from Google OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const oauthError = urlParams.get('error');
    if (oauthError) {
      setError('Google authentication failed. Please try again.');
      setLoading(false);
      return;
    }

    // Optimistically hydrate from localStorage for quick paint
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('userInfo');
      }
    }

    // Always verify with server so Google OAuth redirect sets state correctly
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Try to get user profile using cookies (automatic)
      const response = await API.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.data);
        // Store user info in localStorage for persistence
        localStorage.setItem('userInfo', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // If it's a 401, the token is invalid/expired, clear stored info
      if (error.response?.status === 401) {
        localStorage.removeItem('userInfo');
        setUser(null);
      }
      // Don't clear user if it's a network/server error
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await API.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { data } = response.data;
        setUser(data);
        
        // Store user info in localStorage for persistence
        localStorage.setItem('userInfo', JSON.stringify(data));
        
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      setError(null);
      const response = await API.post('/auth/signup', { name, email, password });
      
      if (response.data.success) {
        const { data } = response.data;
        setUser(data);
        
        // Store user info in localStorage for persistence
        localStorage.setItem('userInfo', JSON.stringify(data));
        
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user state and stored info regardless of API call success
      setUser(null);
      localStorage.removeItem('userInfo');
    }
  };

  // Handle Google OAuth redirect
  const handleGoogleOAuthRedirect = () => {
    // Check if we have a user after Google OAuth redirect
    checkAuthStatus();
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    handleGoogleOAuthRedirect,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
