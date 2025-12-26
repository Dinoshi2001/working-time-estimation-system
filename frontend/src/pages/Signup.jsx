import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/Auth.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {
  const navigate = useNavigate();

  // State to store form data
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData);
      Swal.fire("Success", res.data.message, "success");
      navigate("/login");
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h3 className="auth-title">Create Account</h3>
        <p className="auth-subtitle">Fill in the details to sign up</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control mb-3"
            placeholder="Name"
          />

          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="form-control mb-3"
          >
            <option value="">Select Designation</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Software Engineer">Software Engineer</option>
          </select>

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
            className="form-control mb-3"
            placeholder="Password"
          />

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-control mb-4"
            placeholder="Confirm Password"
          />

          <button type="submit" className="btn-signup w-100 mb-3">
            Sign Up
          </button>
        </form>

        <p className="login-link-text">
          Already have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
