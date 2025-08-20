const { google } = require('googleapis');
const User = require('../models/User');

function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/google/callback`
  );
  return client;
}

async function createCalendarEvent(userId, task) {
  const user = await User.findById(userId);
  if (!user || !user.googleRefreshToken) {
    throw new Error('Google Calendar not authorized');
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: user.googleRefreshToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // Build event. If no dueDate, skip
  if (!task.dueDate) {
    throw new Error('Task has no due date');
  }

  const start = new Date(task.dueDate);
  const end = new Date(start.getTime() + 30 * 60 * 1000); // default 30 min duration

  const event = {
    summary: task.title,
    description: task.description || 'Task from FocusFiesta',
    start: { dateTime: start.toISOString() },
    end: { dateTime: end.toISOString() },
  };

  const resp = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  return resp.data;
}

module.exports = { createCalendarEvent };


