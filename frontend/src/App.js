import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// AUTH Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// PM Pages
import PMLayout from "./pages/pm/PMLayout";
import PMDashboard from "./pages/pm/PMDashboard";
import TaskList from "./pages/pm/TaskList";
import Settings from "./pages/pm/Settings";
import TimeEstimate from "./pages/pm/TimeEstimate";

// SE Pages
import SETaskList from "./pages/se/SETaskList";
import SELayout from "./pages/se/SELayout";
import SEDashboard from "./pages/se/SEDashboard";


function App() {
  return (
    <Router>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROJECT MANAGER */}
        <Route path="/pm" element={<PMLayout />}>
          <Route index element={<PMDashboard />} /> {}
          <Route path="dashboard" element={<PMDashboard />} />
          <Route path="tasks" element={<TaskList />} />
          <Route path="settings" element={<Settings />} />
          <Route path="/pm/time-estimate" element={<TimeEstimate />} />
        </Route>

   {/* SOFTWARE ENGINEER */}
        <Route path="/se" element={<SELayout />}>
          <Route index element={<SEDashboard />} /> {}
          <Route path="dashboard" element={<SEDashboard />} />
           <Route path="tasks" element={<SETaskList />} /> {}
          {}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
