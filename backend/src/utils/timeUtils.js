

const WORK_START = 8;
const WORK_END = 16;
const WORK_HOURS_PER_DAY = 8;

const isHoliday = (date, settings) => {
  const oneTime = settings.oneTimeHolidays.map(h =>
    new Date(h.date).toDateString()
  );
  if (oneTime.includes(date.toDateString())) return true;

  const d = date.getDate();
  const m = date.getMonth() + 1;
  return settings.recurringHolidays.some(h => h.day === d && h.month === m);
};

const normalizeStartTime = (date, forward) => {
  const hour = date.getHours() + date.getMinutes() / 60;

  if (forward && hour >= WORK_END) {
    date.setDate(date.getDate() + 1);
    date.setHours(WORK_START, 0, 0, 0);
  } else if (!forward && hour <= WORK_START) {
    date.setDate(date.getDate() - 1);
    date.setHours(WORK_END, 0, 0, 0);
  }
};

const calculateEndDateTime = (task, settings) => {
  const [h, m] = task.startTime.split(":").map(Number);
  let current = new Date(task.startDate);
  current.setHours(h, m, 0, 0);

  let remainingHours = task.estimatedTime * WORK_HOURS_PER_DAY;
  const forward = remainingHours >= 0;

  normalizeStartTime(current, forward);

  while (Math.abs(remainingHours) > 0.0001) {
    if (isHoliday(current, settings)) {
      current.setDate(current.getDate() + (forward ? 1 : -1));
      current.setHours(forward ? WORK_START : WORK_END, 0, 0, 0);
      continue;
    }

    const now = current.getHours() + current.getMinutes() / 60;

    let available;
    if (forward) {
      available = WORK_END - now;
      if (available <= 0) {
        current.setDate(current.getDate() + 1);
        current.setHours(WORK_START, 0, 0, 0);
        continue;
      }
    } else {
      available = now - WORK_START;
      if (available <= 0) {
        current.setDate(current.getDate() - 1);
        current.setHours(WORK_END, 0, 0, 0);
        continue;
      }
    }

    const used = Math.min(Math.abs(remainingHours), available);
    current.setMinutes(current.getMinutes() + used * 60 * (forward ? 1 : -1));
    remainingHours -= used * (forward ? 1 : -1);
  }

  return {
    endDate: current.toISOString().split("T")[0],
    endTime: current.toTimeString().slice(0, 5),
  };
};

module.exports = { calculateEndDateTime };
