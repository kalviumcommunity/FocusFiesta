const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
      // select: false, // don’t return password by default in queries
    },
    googleId: {
      type: String,
      index: true,
    },
    googleRefreshToken: {
      type: String,
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

module.exports = mongoose.model('User', userSchema);
