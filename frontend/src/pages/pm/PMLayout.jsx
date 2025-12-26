import React from "react";
import { Outlet } from "react-router-dom";

import PMHeader from "../components/PMHeader";
import PMSidebar from "../components/PMSidebar";
import PMFooter from "../components/PMFooter";

import "../../css/pm.css";

const PMLayout = () => {
  return (
    <div className="pm-container">
      <PMHeader />

      <div className="pm-body">
        <PMSidebar />
        <div className="pm-content">
          <Outlet />
        </div>
      </div>

      <PMFooter />
    </div>
  );
};

export default PMLayout;
