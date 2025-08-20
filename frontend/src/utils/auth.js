// Utility functions for handling JWT authentication

export const getTokenFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token');
};

export const storeToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    // Remove token from URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

export const getStoredToken = () => {
  return localStorage.getItem('authToken');
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  const token = getStoredToken();
  return !!token;
};
