const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Create Task
router.post("/", async (req, res) => {
  try {
    const { taskCode, title, description } = req.body;
    const task = await Task.create({ taskCode, title, description, status: "Pending" });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating task", error: err.message });
  }
});

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
});

module.exports = router;
