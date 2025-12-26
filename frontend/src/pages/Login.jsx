import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/Auth.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      const user = res.data.user;

      // Save user 
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect by designation
      if (user.designation === "Project Manager") navigate("/pm/dashboard");
      else if (user.designation === "Software Engineer") navigate("/se/dashboard");
    } catch (err) {
      Swal.fire(
        "Login Failed",
        err.response?.data?.message || "Invalid credentials",
        "error"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h3 className="auth-title">Welcome Back</h3>
        <p className="auth-subtitle">Please login to your account</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control mb-3"
            placeholder="Email"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control mb-4"
            placeholder="Password"
          />

          <button type="submit" className="btn-login w-100 mb-3">
            Login
          </button>
        </form>

        <p style={{ textAlign: "center" }}>
          Don't have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
