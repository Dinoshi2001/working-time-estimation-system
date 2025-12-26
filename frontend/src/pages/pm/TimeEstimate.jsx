import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/timeEstimate.css";

const TimeEstimate = () => {
  const [tasks, setTasks] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [taskRes, engineerRes] = await Promise.all([
        axios.get("http://localhost:5000/api/timeestimate"),
        axios.get("http://localhost:5000/api/users/engineers"),
      ]);

      setTasks(taskRes.data);
      setEngineers(engineerRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load time estimate data");
    } finally {
      setLoading(false);
    }
  };

  const getEngineerName = (id) => {
    const engineer = engineers.find((e) => e._id === id);
    return engineer ? engineer.name : "Unknown";
  };

  const getStatusClass = (status) => {
    if (!status) return "";
    return status.toLowerCase().replace(" ", "-");
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  return (
    <div className="time-estimate-container">
      <h2>Time Estimate Details</h2>

      <div className="time-estimate-card">
        <table className="task-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Task Code</th>
              <th>Title</th>
              <th>Description</th>
              <th>Assigned Engineer</th>
              <th>Start Date</th>
              <th>Start Time</th>
              <th>End Date</th>
              <th>End Time</th>
              <th>Engineer Estimate Days</th>
              <th>Working Status</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: "center" }}>
                  No data available
                </td>
              </tr>
            ) : (
              tasks.map((task, index) => (
                <tr key={task._id}>
                  <td>{index + 1}</td>
                  <td>{task.taskCode}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{getEngineerName(task.assignedTo)}</td>
                  <td>{task.startDate}</td>
                  <td>{task.startTime}</td>
                  <td>{task.endDate || "-"}</td>
                  <td>{task.endTime || "-"}</td>
                  <td>{task.estimatedTime}</td>
                  <td>
                    <span className={`status ${getStatusClass(task.workingStatus)}`}>
                      {task.workingStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeEstimate;
