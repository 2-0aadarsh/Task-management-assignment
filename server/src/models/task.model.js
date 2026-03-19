import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },

  dueDate: {
    type: Date,
    default: null
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  deletedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  }
});

// automatically exclude soft‑deleted docs
taskSchema.pre(/^find/, function () {
    // Apply soft‑delete filter automatically
    this.where({ isDeleted: false });
  });

// Keep pagination counts consistent with `find()` results
taskSchema.pre("countDocuments", function () {
  this.where({ isDeleted: false });
});

const Task = mongoose.model('Task', taskSchema);

export default Task;