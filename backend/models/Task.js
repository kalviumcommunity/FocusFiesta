const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true   // Index for faster queries by user
    },
    title: { 
      type: String, 
      required: [true, "Task title is required"], 
      trim: true,
      maxlength: 100 
    },
    description: { 
      type: String, 
      trim: true,
      maxlength: 1000 
    },
    // status: { 
    //   type: String, 
    //   enum: ['To-do', 'In-progress', 'Done'], 
    //   default: 'To-do' 
    // },
     isCompleted: {
    type: Boolean,
    default: false,  // by default, task is not completed
  },
    estimatedPomodoros: { 
      type: Number, 
      min: [1, "At least 1 Pomodoro required"], 
      max: 20 
    },
    completedPomodoros: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    dueDate: { type: Date },
  },
  { 
    timestamps: true 
  }
);

// Virtual field: check if task is overdue
taskSchema.virtual('isOverdue').get(function () {
  return this.dueDate ? this.dueDate < new Date() && this.status !== 'Done' : false;
});



module.exports = mongoose.model('Task', taskSchema);
