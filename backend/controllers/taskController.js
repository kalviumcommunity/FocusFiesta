const Task = require('../models/Task');

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching tasks' });
  }
}; 

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, estimatedPomodoros, addToGoogleCalendar } = req.body;

    // Basic validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    // Prepare task data with proper validation
    const taskData = {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      userId: req.user.userId,
    };

    // Only add estimatedPomodoros if it's a valid positive number
    if (estimatedPomodoros !== undefined && estimatedPomodoros !== null && estimatedPomodoros > 0) {
      taskData.estimatedPomodoros = Number(estimatedPomodoros);
    }

    const task = await Task.create(taskData);

    // Optionally create Google Calendar event
    if (addToGoogleCalendar && dueDate) {
      try {
        const { createCalendarEvent } = require('../services/googleCalendar');
        await createCalendarEvent(req.user.userId, task);
      } catch (calendarErr) {
        console.error('Calendar sync failed:', calendarErr?.message || calendarErr);
        // Do not fail task creation on calendar error
      }
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ success: false, message: 'Server error while creating task' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    // Extract fields that can be updated
    const { title, description, dueDate, estimatedPomodoros, isCompleted } = req.body;

    const updatedFields = {};
    if (title !== undefined) updatedFields.title = title;
    if (description !== undefined) updatedFields.description = description;
    if (dueDate !== undefined) updatedFields.dueDate = dueDate ? new Date(dueDate) : undefined;
    if (estimatedPomodoros !== undefined && estimatedPomodoros !== null && estimatedPomodoros > 0) {
      updatedFields.estimatedPomodoros = Number(estimatedPomodoros);
    } else if (estimatedPomodoros === null || estimatedPomodoros === 0) {
      // Allow setting to null/0 to remove the field
      updatedFields.estimatedPomodoros = undefined;
    }
    if (isCompleted !== undefined) updatedFields.isCompleted = isCompleted;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: 'Task not found or not authorized' });
    }

    res.status(200).json({
      success: true,
      message: `Task updated successfully${isCompleted !== undefined ? (isCompleted ? ' (marked as completed)' : ' (marked as not completed)') : ''}`,
      data: task,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error while updating task' });
  }
};


// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or not authorized' });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting task' });
  }
};
