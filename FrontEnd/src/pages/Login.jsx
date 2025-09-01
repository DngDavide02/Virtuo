import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/login.css";
import { loginUser } from "../js/authService";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await loginUser(username, password);
      navigate("/"); // Redirect alla home
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Virtuo</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)} required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" className="pill-button primary">
            Login
          </button>

          {error && <p className="error-message">{error}</p>}
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
