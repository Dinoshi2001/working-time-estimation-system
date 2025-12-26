import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiClipboard, FiLogOut } from "react-icons/fi";
import "../../css/SELayout.css";

const SELayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear stored user
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="se-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Engineer Dashboard</h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/se/dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>
                <FiHome className="nav-icon" />
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/se/tasks" className={({ isActive }) => isActive ? "active-link" : ""}>
                <FiClipboard className="nav-icon" />
                <span>My Tasks</span>
              </NavLink>
            </li>

            {/* LOGOUT */}
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                <FiLogOut className="nav-icon" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default SELayout;
