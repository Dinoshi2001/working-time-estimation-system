
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  taskCode: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "Pending" },
  workingStatus: { type: String, default: "Pending" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  startDate: { type: String },
  startTime: { type: String },
  estimatedTime: { type: Number }, 
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
