const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Settings = require("../models/Settings");

//Holiday checker 
const isHoliday = (date, settings) => {
  const oneTimeHolidays = settings.oneTimeHolidays.map(h =>
    new Date(h.date).toDateString()
  );

  if (oneTimeHolidays.includes(date.toDateString())) return true;

  const day = date.getDate();
  const month = date.getMonth() + 1;

  return settings.recurringHolidays.some(
    h => h.day === day && h.month === month
  );
};

//End date calculator 
const calculateEndDateTime = (task, settings) => {
  const [startHour, startMinute] = task.startTime.split(":").map(Number);
  const [workStartHour] = settings.workingHours.start.split(":").map(Number);
  const [workEndHour] = settings.workingHours.end.split(":").map(Number);

  const hoursPerDay = workEndHour - workStartHour;
  let remainingHours = task.estimatedTime * hoursPerDay;

  let current = new Date(task.startDate);
  current.setHours(startHour, startMinute, 0, 0);

  while (remainingHours > 0) {
    if (
      isHoliday(current, settings) ||
      current.getHours() >= workEndHour
    ) {
      current.setDate(current.getDate() + 1);
      current.setHours(workStartHour, 0, 0, 0);
      continue;
    }

    const hoursLeftToday =
      workEndHour - (current.getHours() + current.getMinutes() / 60);

    const worked = Math.min(remainingHours, hoursLeftToday);

    current.setMinutes(current.getMinutes() + worked * 60);
    remainingHours -= worked;

    if (remainingHours > 0) {
      current.setDate(current.getDate() + 1);
      current.setHours(workStartHour, 0, 0, 0);
    }
  }

  return {
    endDate: current.toISOString().split("T")[0],
    endTime: current.toTimeString().slice(0, 5),
  };
};


//GET time estimates 
router.get("/", async (req, res) => {
  try {
    const settings = await Settings.findOne({});
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    // only assigned tasks
    const tasks = await Task.find({
      assignedTo: { $exists: true, $ne: null }
    });

    const result = tasks.map(task => {
      if (!task.startDate || !task.startTime || !task.estimatedTime) {
        return task;
      }

      const { endDate, endTime } = calculateEndDateTime(task, settings);

      return {
        ...task.toObject(),
        endDate,
        endTime,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load time estimates" });
  }
});


module.exports = router;
