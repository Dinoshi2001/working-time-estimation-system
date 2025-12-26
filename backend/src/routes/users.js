const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get all software engineers
router.get("/engineers", async (req, res) => {
  try {
    const engineers = await User.find({ designation: "Software Engineer" }).select("name _id");
    res.status(200).json(engineers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch engineers" });
  }
});


//  GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}).select("name _id designation");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;
