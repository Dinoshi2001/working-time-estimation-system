import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTasks, FaCog, FaSignOutAlt, FaHome, FaCalculator } from "react-icons/fa";

const PMSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="pm-sidebar">
      <h2 className="sidebar-title">PM Panel</h2>

      <ul className="sidebar-menu">
        <li>
          <NavLink to="/pm/dashboard">
            <FaHome /> Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/pm/tasks">
            <FaTasks /> Tasks
          </NavLink>
        </li>

        <li>
          <NavLink to="/pm/settings">
            <FaCog /> Settings
          </NavLink>
        </li>

        {/* New Time Estimate Link */}
        <li>
          <NavLink to="/pm/time-estimate">
            <FaCalculator /> Time Estimate
          </NavLink>
        </li>

        <li className="logout" onClick={logout}>
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    </div>
  );
};

export default PMSidebar;
