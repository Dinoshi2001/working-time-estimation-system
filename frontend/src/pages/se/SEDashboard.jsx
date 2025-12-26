import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTasks, FaClock, FaCheckCircle, FaSpinner } from "react-icons/fa";
import "../../css/SELayout.css";

const SEDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks/engineer/${user.id}`
      );
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to load tasks", error);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic values
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.workingStatus === "Pending").length;
  const inProgressTasks = tasks.filter(t => t.workingStatus === "In Progress").length;
  const completedTasks = tasks.filter(t => t.workingStatus === "Completed").length;

  if (loading) return <p style={{ padding: "20px" }}>Loading dashboard...</p>;

  return (
    <div className="se-dashboard">
      <h1 className="dashboard-title">
        Welcome, {user?.name}
      </h1>

      {/* === SUMMARY CARDS  === */}
      <div className="dashboard-cards">
        <div className="card total-tasks">
          <div className="card-icon"><FaTasks /></div>
          <div className="card-content">
            <h3>Total Tasks</h3>
            <p>{totalTasks}</p>
          </div>
        </div>

        <div className="card pending-tasks">
          <div className="card-icon"><FaClock /></div>
          <div className="card-content">
            <h3>Pending Tasks</h3>
            <p>{pendingTasks}</p>
          </div>
        </div>

        <div className="card in-progress-tasks">
          <div className="card-icon"><FaSpinner /></div>
          <div className="card-content">
            <h3>In Progress</h3>
            <p>{inProgressTasks}</p>
          </div>
        </div>

        <div className="card completed-tasks">
          <div className="card-icon"><FaCheckCircle /></div>
          <div className="card-content">
            <h3>Completed Tasks</h3>
            <p>{completedTasks}</p>
          </div>
        </div>
      </div>

     
      <div className="recent-tasks">
        <h3>Recently Assigned Tasks</h3>

        {tasks.length === 0 ? (
          <p>No tasks assigned yet</p>
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th>Task Code</th>
                <th>Title</th>
                <th>Status</th>
                <th>Estimate (Days)</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 5).map(task => (
                <tr key={task._id}>
                  <td>{task.taskCode}</td>
                  <td>{task.title}</td>
                  <td>{task.workingStatus}</td>
                  <td>{task.estimatedTime || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SEDashboard;
