import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaPlus, FaTasks, FaCheckCircle } from "react-icons/fa";
import "../../css/TaskList.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState("");

  const [taskCode, setTaskCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  /* ================= FETCH DATA ================= */
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch {
      Swal.fire("Error", "Failed to fetch tasks", "error");
    }
  };

  const fetchEngineers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/engineers");
      setEngineers(res.data);
    } catch {
      Swal.fire("Error", "Failed to fetch engineers", "error");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchEngineers();
  }, []);

  /* ================= ADD TASK ================= */
  const handleAddTask = async (e) => {
    e.preventDefault();
    let errors = [];
    if (!taskCode.trim()) errors.push("Task Code is required");
    if (!title.trim()) errors.push("Title is required");

    if (errors.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        html: errors.map((e) => `<p>${e}</p>`).join("")
      });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/tasks", {
        taskCode,
        title,
        description
      });

      setTasks([res.data, ...tasks]);
      setShowAddModal(false);
      setTaskCode("");
      setTitle("");
      setDescription("");

      Swal.fire("Success", "Task added successfully", "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  /* ================= ASSIGN TASK ================= */
  const openAssignModal = (task) => {
    setSelectedTask(task);
    setSelectedEngineer(task.assignedTo?._id || "");
    setShowAssignModal(true);
  };

  const handleAssign = async () => {
    if (!selectedEngineer) {
      Swal.fire("Validation", "Please select an engineer", "warning");
      return;
    }

    if (!selectedTask.startDate || !selectedTask.startTime) {
      Swal.fire("Validation", "Please select start date and start time", "warning");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${selectedTask._id}/assign`,
        {
          engineerId: selectedEngineer,
          startDate: selectedTask.startDate,
          startTime: selectedTask.startTime,
        }
      );

      setTasks(
        tasks.map((t) =>
          t._id === selectedTask._id
            ? {
                ...t,
                assignedTo: engineers.find((e) => e._id === selectedEngineer),
                status: "Assigned",
                startDate: selectedTask.startDate,
                startTime: selectedTask.startTime,
              }
            : t
        )
      );

      setShowAssignModal(false);
      Swal.fire("Assigned", "Task assigned successfully", "success");
    } catch {
      Swal.fire("Error", "Failed to assign task", "error");
    }
  };

 
  return (
    <div className="tasklist-container">
      <div className="header-section">
        <h2>Task Management</h2>
        <button className="add-task-btn" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Add Task
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <table className="tasks-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Task Code</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Start Date</th>
            <th>Start Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task._id}>
              <td>{index + 1}</td>
              <td>{task.taskCode}</td>
              <td>{task.title}</td>
              <td>{task.description || "-"}</td>
              <td>{task.status}</td>
              <td>{task.assignedTo ? task.assignedTo.name : "N/A"}</td>
              <td>{task.startDate || "-"}</td>
              <td>{task.startTime || "-"}</td>
              <td>
                {task.assignedTo ? (
                  <button className="assigned-btn" disabled>
                    <FaCheckCircle /> Assigned
                  </button>
                ) : (
                  <button
                    className="assign-btn"
                    onClick={() => openAssignModal(task)}
                  >
                    <FaTasks /> Assign
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= ADD MODAL ================= */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 className="modal-title">Add New Task</h3>
            <form onSubmit={handleAddTask} className="modal-form">
              <div className="form-group">
                <label>Task Code *</label>
                <input
                  type="text"
                  value={taskCode}
                  onChange={(e) => setTaskCode(e.target.value)}
                  placeholder="Enter Task Code"
                />
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Task Title"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Task Description"
                  rows={4}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ASSIGN MODAL ================= */}
      {showAssignModal && (
        <div className="modal-overlay">
          <div className="modal-card assign-modal">
            <h3 className="modal-title">Assign Task</h3>
            <p><strong>{selectedTask?.title}</strong></p>

            <form>
              {/* Engineer dropdown */}
              <div className="form-group">
                <label>Select Engineer *</label>
                <select
                  value={selectedEngineer}
                  onChange={(e) => setSelectedEngineer(e.target.value)}
                >
                  <option value="">-- Select Engineer --</option>
                  {engineers.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  value={selectedTask?.startDate || ""}
                  onChange={(e) =>
                    setSelectedTask({ ...selectedTask, startDate: e.target.value })
                  }
                />
              </div>

              {/* Start Time */}
              <div className="form-group">
                <label>Start Time *</label>
                <input
                  type="time"
                  value={selectedTask?.startTime || ""}
                  onChange={(e) =>
                    setSelectedTask({ ...selectedTask, startTime: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="save-btn"
                  onClick={handleAssign}
                >
                  Assign
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
