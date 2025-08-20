const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },

    taskId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Task', 
      required: true 
    },

    duration: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 190, // prevent absurdly long "sessions"
    },

    completedAt: { 
      type: Date 
    },

    isCompleted: { 
      type: Boolean, 
      default: false 
    },
  },
  { 
    timestamps: true 
  }
);

//  Pre-save hook to auto set completedAt if session is marked completed
sessionSchema.pre('save', function(next) {
  if (this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

//Virtual field: session length in HH:MM format
sessionSchema.virtual('formattedDuration').get(function () {
  const hrs = Math.floor(this.duration / 60);
  const mins = this.duration % 60;
  return `${hrs > 0 ? hrs + 'h ' : ''}${mins}m`;
});

module.exports = mongoose.model('Session', sessionSchema);
