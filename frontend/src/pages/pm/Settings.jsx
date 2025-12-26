import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import "../../css/PMSettings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("add");

  // Form state
  const [workingStart, setWorkingStart] = useState("08:00");
  const [workingEnd, setWorkingEnd] = useState("16:00");
  const [recurringHolidays, setRecurringHolidays] = useState([]);
  const [newRecurring, setNewRecurring] = useState("");
  const [oneTimeHolidays, setOneTimeHolidays] = useState([]);
  const [newOneTime, setNewOneTime] = useState("");

  // View tab state
  const [allSettings, setAllSettings] = useState([]);
  const [filters, setFilters] = useState({ date: "", type: "", time: "" });

  useEffect(() => {
    if (activeTab === "view") fetchAllSettings();
  }, [activeTab]);

  const fetchAllSettings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/settings");
      setAllSettings(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch settings", "error");
    }
  };

  const addRecurringHoliday = () => {
    const regex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!newRecurring) return Swal.fire("Error", "Please enter recurring holiday (MM-DD)", "error");
    if (!regex.test(newRecurring)) return Swal.fire("Error", "Invalid format MM-DD", "error");
    if (recurringHolidays.includes(newRecurring)) return Swal.fire("Error", "Recurring holiday already exists", "error");
    setRecurringHolidays([...recurringHolidays, newRecurring]);
    setNewRecurring("");
  };

  const addOneTimeHoliday = () => {
    if (!newOneTime) return Swal.fire("Error", "Please select a date", "error");
    if (oneTimeHolidays.includes(newOneTime)) return Swal.fire("Error", "One-time holiday already exists", "error");
    setOneTimeHolidays([...oneTimeHolidays, newOneTime]);
    setNewOneTime("");
  };

  const removeRecurring = (h) => setRecurringHolidays(recurringHolidays.filter((r) => r !== h));
  const removeOneTime = (h) => setOneTimeHolidays(oneTimeHolidays.filter((r) => r !== h));

  const saveSettings = async () => {
    if (recurringHolidays.length === 0 && oneTimeHolidays.length === 0) return Swal.fire("Error", "Add at least one holiday", "error");
    try {
      await axios.post("http://localhost:5000/api/settings", {
        workingHours: { start: workingStart, end: workingEnd },
        recurringHolidays,
        oneTimeHolidays,
      });
      setWorkingStart("08:00");
      setWorkingEnd("16:00");
      setRecurringHolidays([]);
      setOneTimeHolidays([]);
      setNewRecurring("");
      setNewOneTime("");
      Swal.fire("Success", "Settings saved successfully!", "success");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save settings";
      Swal.fire("Error", msg, "error");
    }
  };

  // Filter helper
  const applyFilters = (data) => {
    return data.flatMap((s) => {
      const rows = [];

      s.recurringHolidays.forEach((h) => {
        const date = `${h.month.toString().padStart(2, "0")}-${h.day.toString().padStart(2, "0")}`;
        const type = "Recurring";
        const time = `${s.workingHours.start} - ${s.workingHours.end}`;
        if (
          date.includes(filters.date) &&
          type.toLowerCase().includes(filters.type.toLowerCase()) &&
          time.includes(filters.time)
        ) rows.push({ date, type, time });
      });

      s.oneTimeHolidays.forEach((h) => {
        const date = h.date;
        const type = "One-time";
        const time = `${s.workingHours.start} - ${s.workingHours.end}`;
        if (
          date.includes(filters.date) &&
          type.toLowerCase().includes(filters.type.toLowerCase()) &&
          time.includes(filters.time)
        ) rows.push({ date, type, time });
      });

      return rows;
    });
  };

  const filteredData = applyFilters(allSettings);

  return (
    <div className="settings-container">
      <h2>Project Settings</h2>
      <div className="tabs">
        <button className={activeTab === "add" ? "tab active" : "tab"} onClick={() => setActiveTab("add")}>Add Settings</button>
        <button className={activeTab === "view" ? "tab active" : "tab"} onClick={() => setActiveTab("view")}>View Settings</button>
      </div>

      {activeTab === "add" && (
        <>
          <div className="settings-card">
            <label>Working Hours</label>
            <div className="row">
              <input type="time" value={workingStart} onChange={(e) => setWorkingStart(e.target.value)} />
              <input type="time" value={workingEnd} onChange={(e) => setWorkingEnd(e.target.value)} />
            </div>
          </div>

          <div className="settings-card">
            <label>Recurring Holidays (MM-DD)</label>
            <div className="row">
              <input type="text" placeholder="MM-DD" value={newRecurring} onChange={(e) => setNewRecurring(e.target.value)} maxLength={5} />
              <button className="add-btn" onClick={addRecurringHoliday}><FaPlus /> Add</button>
            </div>
            <div className="holiday-tags">{recurringHolidays.map((h, i) => <span key={i} className="holiday-tag">{h} <FaTimes onClick={() => removeRecurring(h)} /></span>)}</div>
          </div>

          <div className="settings-card">
            <label>One-time Holidays</label>
            <div className="row">
              <input type="date" value={newOneTime} onChange={(e) => setNewOneTime(e.target.value)} />
              <button className="add-btn" onClick={addOneTimeHoliday}><FaPlus /> Add</button>
            </div>
            <div className="holiday-tags">{oneTimeHolidays.map((h, i) => <span key={i} className="holiday-tag">{h} <FaTimes onClick={() => removeOneTime(h)} /></span>)}</div>
          </div>

          <button className="save-btn" onClick={saveSettings}>Save Settings</button>
        </>
      )}

      {activeTab === "view" && (
        <div className="settings-card view-card">
          <table className="settings-table">
            <thead>
              <tr>
                <th>
                  Date<br/>
                  <input type="text" placeholder="Filter date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
                </th>
                <th>
                  Holiday Type<br/>
                  <input type="text" placeholder="Filter type" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} />
                </th>
                <th>
                  Working Hours<br/>
                  <input type="text" placeholder="Filter time" value={filters.time} onChange={(e) => setFilters({ ...filters, time: e.target.value })} />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? filteredData.map((row, i) => (
                <tr key={i}>
                  <td>{row.date}</td>
                  <td>{row.type}</td>
                  <td>{row.time}</td>
                </tr>
              )) : <tr><td colSpan="3" style={{ textAlign: "center" }}>No data found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Settings;
