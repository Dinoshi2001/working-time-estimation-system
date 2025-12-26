const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    workingHours: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },

    recurringHolidays: [
      {
        day: Number,
        month: Number,
      },
    ],

    oneTimeHolidays: [
      {
        date: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema);
