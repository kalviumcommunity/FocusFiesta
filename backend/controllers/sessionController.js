const Session = require('../models/Session');
const mongoose = require('mongoose');

//Log a new session : records a work session
exports.logSession = async (req, res) => {
  try {
    const { taskId, duration } = req.body;

    // Validation
    if (!taskId || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Task ID and duration are required',
      });
    }

    // Convert seconds to minutes (rounded) for storage constraints
    const durationMinutes = Math.max(1, Math.round(Number(duration || 0) / 60));

    const session = await Session.create({
      userId: req.user.userId,
      taskId,
      duration: durationMinutes,
      isCompleted: true,
      completedAt: new Date(),
    });

    // Increment completed pomodoros on the task if a full work session completed
    // Assuming a pomodoro is counted if durationMinutes >= 1 (or compare to configured work length if stored)
    const Task = require('../models/Task');
    await Task.updateOne(
      { _id: taskId, userId: req.user.userId },
      { $inc: { completedPomodoros: 1 } }
    );

    res.status(201).json({
      success: true,
      message: 'Session logged successfully',
      data: session,
    });
  } catch (error) {
    console.error('Error logging session:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while logging session',
    });
  }
};

//Get all sessions : get's all the sessions of the logged in user with task details
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.userId })
      .populate('taskId', 'title description') // optional: populate task details
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sessions',
    });
  }
};

//Get daily & weekly stats: retrieves session statistics for the logged-in user and for that it Figures out start of today and start of this week.
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const now = new Date();

    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );

    // Stats
    const daily = await Session.aggregate([
      { 
        $match: { 
          userId: userObjectId, 
          $or: [
            { completedAt: { $gte: startOfDay } },
            { completedAt: { $exists: false }, createdAt: { $gte: startOfDay } }
          ]
        } 
      },
      { $group: { _id: null, totalDuration: { $sum: '$duration' }, count: { $sum: 1 } } },
    ]);

    const weekly = await Session.aggregate([
      { 
        $match: { 
          userId: userObjectId, 
          $or: [
            { completedAt: { $gte: startOfWeek } },
            { completedAt: { $exists: false }, createdAt: { $gte: startOfWeek } }
          ]
        } 
      },
      { $group: { _id: null, totalDuration: { $sum: '$duration' }, count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        daily: {
          sessions: daily[0]?.count || 0,
          totalDuration: daily[0]?.totalDuration || 0,
        },
        weekly: {
          sessions: weekly[0]?.count || 0,
          totalDuration: weekly[0]?.totalDuration || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stats',
    });
  }
};
