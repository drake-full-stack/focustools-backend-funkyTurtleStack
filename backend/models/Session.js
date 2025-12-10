const mongoose = require("mongoose");

// TODO: Define your Session schema here
const sessionSchema = new mongoose.Schema(
  {
    // TODO: Add taskId field (ObjectId, ref: 'Task', required)
    taskId:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    },
    // TODO: Add duration field (Number, required, min: 1)
    duration:
    {
      type: Number,
      required: true,
      min: 1
    },
    // TODO: Add completed field (Boolean, default: true)
    completed:
    {
      type: Boolean,
      default: true
    },
    // TODO: Add startTime field (Date, required)
    startTime:
    {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;