import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../css/SETaskList.css";

const SETaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [estimateTime, setEstimateTime] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      Swal.fire("Error", "User not logged in", "error");
      return;
    }
    fetchTasks(user.id);
  }, []);

  const fetchTasks = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks/engineer/${userId}`
      );
      setTasks(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch engineer tasks", "error");
    }
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setEstimateTime(task.estimatedTime || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
    setEstimateTime("");
  };

  const saveEstimate = async () => {
    if (estimateTime === "" || estimateTime === null) {
      Swal.fire("Error", "Please enter estimated time", "error");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${selectedTask._id}/estimate`,
        { estimatedTime: parseFloat(estimateTime) }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task._id === selectedTask._id
            ? { ...task, estimatedTime: parseFloat(estimateTime) }
            : task
        )
      );

      Swal.fire("Success", "Estimate saved successfully", "success");
      closeModal();
    } catch (err) {
      Swal.fire("Error", "Failed to save estimate", "error");
    }
  };

  const updateWorkingStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}/status`,
        { workingStatus: newStatus }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, workingStatus: newStatus } : task
        )
      );
    } catch (err) {
      Swal.fire("Error", "Failed to update working status", "error");
    }
  };

  return (
    <div className="se-tasks-container">
      <h2>My Tasks</h2>

      <table className="tasks-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Task Code</th>
            <th>Title</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>Start Time</th>
            <th>Status</th>
            <th>Working Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No tasks assigned
              </td>
            </tr>
          ) : (
            tasks.map((task, index) => (
              <tr key={task._id}>
                <td>{index + 1}</td>
                <td>{task.taskCode}</td>
                <td>{task.title}</td>
                <td>{task.description || "-"}</td>
                <td>{task.startDate || "-"}</td>
                <td>{task.startTime || "-"}</td>
                <td>{task.status}</td>
                <td>
                  <select
                    value={task.workingStatus || "Pending"}
                    onChange={(e) =>
                      updateWorkingStatus(task._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>
                  <button
                    className={`btn-estimate ${task.estimatedTime ? "btn-estimated" : ""}`}
                    onClick={() => openModal(task)}
                    disabled={!!task.estimatedTime} 
                  >
                    {task.estimatedTime ? "Estimated" : "Add Estimate"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && selectedTask && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h3 className="modal-title">Estimate Time</h3>
            <p>
              <strong>Task:</strong> {selectedTask.title}
            </p>

            <div className="form-group">
              <label>Estimated Time (fractional days)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={estimateTime}
                onChange={(e) => setEstimateTime(e.target.value)}
                placeholder="Enter estimate e.g., 1.5"
              />
            </div>

            <div className="modal-buttons">
              <button className="btn-save" onClick={saveEstimate}>
                Save
              </button>
              <button className="btn-cancel" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SETaskList;
