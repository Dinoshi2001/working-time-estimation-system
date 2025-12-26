const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// CREATE TASK 
router.post("/", async (req, res) => {
  try {
    const { taskCode, title, description } = req.body;

    if (!taskCode || !title) {
      return res.status(400).json({ message: "Task Code and Title are required" });
    }

    // Check if task code already exists
    const existingTask = await Task.findOne({ taskCode });
    if (existingTask) {
      return res.status(400).json({ message: "Task code already exists" });
    }

    const task = await Task.create({
      taskCode,
      title,
      description,
      status: "Pending",
      workingStatus: "Pending",
      assignedTo: null,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create task", error: err.message });
  }
});

//  ASSIGN TASK 
router.put("/:taskId/assign", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { engineerId, startDate, startTime } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.assignedTo = engineerId;
    task.startDate = startDate;
    task.startTime = startTime;
    task.status = "Assigned";

    await task.save();

    // Populate before sending response
    const populatedTask = await Task.findById(taskId)
      .populate("assignedTo", "name");

    res.status(200).json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: "Failed to assign task" });
  }
});


// GET ALL TASKS
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name") 
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET TASKS FOR ENGINEER
router.get("/engineer/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const tasks = await Task.find({ assignedTo: userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// UPDATE ESTIMATED TIME
router.put("/:taskId/estimate", async (req, res) => {
  const { taskId } = req.params;
  const { estimatedTime } = req.body; 

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.estimatedTime = estimatedTime;
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to update estimated time" });
  }
});

// UPDATE WORKING STATUS
router.put("/:taskId/status", async (req, res) => {
  const { taskId } = req.params;
  const { workingStatus } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.workingStatus = workingStatus;
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to update working status" });
  }
});

module.exports = router;
