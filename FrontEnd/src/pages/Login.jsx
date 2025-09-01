import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Virtuo</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" className="pill-button primary">
            Login
          </button>
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
