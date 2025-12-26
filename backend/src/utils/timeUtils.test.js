const { calculateEndDateTime } = require("./timeUtils");

describe("Time Estimation Tests", () => {
  const settings = {
    workingHours: { start: "08:00", end: "16:00" },
    oneTimeHolidays: [],
    recurringHolidays: []
  };

  const testCases = [
    {
      startDate: "2004-05-24",
      startTime: "18:05",
      estimatedTime: -5.5,
      expectedDate: "2004-05-14",
      expectedTime: "12:00"
    },
    {
      startDate: "2004-05-24",
      startTime: "19:03",
      estimatedTime: 44.723656,
      expectedDate: "2004-07-27",
      expectedTime: "13:47"
    },
    {
      startDate: "2004-05-24",
      startTime: "18:03",
      estimatedTime: -6.7470217,
      expectedDate: "2004-05-13",
      expectedTime: "10:02"
    },
    {
      startDate: "2004-05-24",
      startTime: "08:03",
      estimatedTime: 12.782709,
      expectedDate: "2004-06-10",
      expectedTime: "14:18"
    },
    {
      startDate: "2004-05-24",
      startTime: "07:03",
      estimatedTime: 8.276628,
      expectedDate: "2004-06-04",
      expectedTime: "10:12"
    }
  ];

  testCases.forEach(tc => {
    test(`Estimate ${tc.estimatedTime} days from ${tc.startDate} ${tc.startTime}`, () => {
      const task = {
        startDate: tc.startDate,
        startTime: tc.startTime,
        estimatedTime: tc.estimatedTime
      };
      const result = calculateEndDateTime(task, settings);

      expect(result.endDate).toBe(tc.expectedDate);
      expect(result.endTime).toBe(tc.expectedTime);
    });
  });
});
