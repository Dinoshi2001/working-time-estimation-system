import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import "../../css/Dashboard.css";
import { FaTasks, FaUserCheck } from "react-icons/fa";

const COLORS = ["#FF6B6B", "#FFD93D", "#6BCB77"]; 

const PMDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const totalTasks = tasks.length;
  const assignedTasks = tasks.filter((t) => t.assignedTo).length;

  const pendingTasks = tasks.filter((t) => t.workingStatus === "Pending").length;
  const inProgressTasks = tasks.filter((t) => t.workingStatus === "In Progress").length;
  const completedTasks = tasks.filter((t) => t.workingStatus === "Completed").length;

  const pieData = [
    { name: "Pending", value: pendingTasks },
    { name: "In Progress", value: inProgressTasks },
    { name: "Completed", value: completedTasks },
  ];

  const barData = tasks
    .filter((t) => t.assignedTo && t.estimatedTime)
    .map((t) => ({
      taskCode: t.taskCode,
      estimatedDays: t.estimatedTime,
    }));

  if (loading) return <p style={{ padding: "20px" }}>Loading Dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h2>Project Manager Dashboard</h2>

      {/* Summary Cards */}
      <div className="dashboard-cards">
        <div className="card pm-card total-card">
          <div className="card-icon">
            <FaTasks />
          </div>
          <div className="card-content">
            <h3>Total Tasks</h3>
            <p>{totalTasks}</p>
          </div>
        </div>

        <div className="card pm-card assigned-card">
          <div className="card-icon">
            <FaUserCheck />
          </div>
          <div className="card-content">
            <h3>Assigned Tasks</h3>
            <p>{assignedTasks}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>Task Status Distribution</h3>
          {tasks.length === 0 ? (
            <p style={{ textAlign: "center", padding: "40px", color: "#555" }}>
              No tasks available to display the chart.
            </p>
          ) : (
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          )}
        </div>

        <div className="chart-card">
          <h3>Engineer Estimate per Task</h3>
          {barData.length === 0 ? (
            <p style={{ textAlign: "center", padding: "40px", color: "#555" }}>
              No assigned tasks with estimates available.
            </p>
          ) : (
            <BarChart
              width={600}
              height={300}
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="taskCode" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="estimatedDays" fill="#6C5CE7" name="Estimated Days" />
            </BarChart>
          )}
        </div>
      </div>
    </div>
  );
};

export default PMDashboard;
