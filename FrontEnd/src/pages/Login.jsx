import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { loginUser } from "../js/authService";
import { useAuth } from "../js/AuthContext";
import "../css/login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { values, errors, handleChange, handleSubmit } = useForm({ username: "", password: "" }, async (formData) => {
    await loginUser(formData.username, formData.password, login);
    navigate("/");
  });

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Virtuo</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Your username" value={values.username} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="••••••••" value={values.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="pill-button primary">
            Login
          </button>

          {errors.submit && <p className="error-message">{errors.submit}</p>}
        </form>

        <div className="login-footer">
          <span>Don't have an account? </span>
          <Link to="/register" className="pill-button secondary small">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
