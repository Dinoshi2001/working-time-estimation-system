const Settings = require("../models/Settings");

// Save settings
exports.saveSettings = async (req, res) => {
  try {
    const { workingHours, recurringHolidays, oneTimeHolidays } = req.body;

    if (!workingHours?.start || !workingHours?.end) {
      return res.status(400).json({ message: "Working hours are required" });
    }

    if (new Set(recurringHolidays).size !== recurringHolidays.length) {
      return res.status(400).json({ message: "Duplicate recurring holiday in request" });
    }
    if (new Set(oneTimeHolidays).size !== oneTimeHolidays.length) {
      return res.status(400).json({ message: "Duplicate one-time holiday in request" });
    }

    const formattedRecurring = recurringHolidays.map((d) => {
      const [month, day] = d.split("-").map(Number);
      return { month, day };
    });
    const formattedOneTime = oneTimeHolidays.map((date) => ({ date }));

    const existingSettings = await Settings.find();
    let duplicateRecurring = [];
    let duplicateOneTime = [];

    existingSettings.forEach((s) => {
      const existingRecurring = s.recurringHolidays.map(
        (r) => `${r.month.toString().padStart(2, "0")}-${r.day.toString().padStart(2, "0")}`
      );
      const existingOneTime = s.oneTimeHolidays.map((o) => o.date);

      duplicateRecurring.push(...recurringHolidays.filter((d) => existingRecurring.includes(d)));
      duplicateOneTime.push(...oneTimeHolidays.filter((d) => existingOneTime.includes(d)));
    });

    if (duplicateRecurring.length > 0) {
      return res.status(400).json({
        message: `Recurring holiday(s) already exist: ${[...new Set(duplicateRecurring)].join(", ")}`,
      });
    }
    if (duplicateOneTime.length > 0) {
      return res.status(400).json({
        message: `One-time holiday(s) already exist: ${[...new Set(duplicateOneTime)].join(", ")}`,
      });
    }

    const settings = new Settings({
      workingHours,
      recurringHolidays: formattedRecurring,
      oneTimeHolidays: formattedOneTime,
    });

    await settings.save();
    res.status(200).json({ message: "Settings saved successfully", settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Failed to save settings" });
  }
};

// GET all settings
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Settings.find();
  
    res.status(200).json(settings || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Failed to fetch settings" });
  }
};
