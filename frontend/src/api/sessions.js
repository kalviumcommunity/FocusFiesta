import API from './api';

const SESSIONS_API = '/sessions';

// Log a new session
export const logSession = async (taskId, durationSeconds) => {
  try {
    // durationSeconds will be converted to minutes on the server
    const response = await API.post(SESSIONS_API, {
      taskId,
      duration: durationSeconds,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging session:', error);
    throw error;
  }
};

// Get all sessions for the current user
export const getSessions = async () => {
  try {
    const response = await API.get(SESSIONS_API);
    return response.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

// Get session statistics (daily/weekly)
export const getSessionStats = async () => {
  try {
    const response = await API.get(`${SESSIONS_API}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session stats:', error);
    throw error;
  }
};
