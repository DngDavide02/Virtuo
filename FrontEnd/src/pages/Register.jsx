import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/login.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Register attempt:", { username, email, password });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)} required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" className="pill-button primary">
            Register
          </button>
        </form>
        <div className="login-footer">
          <span>Already have an account? </span>
          <Link to="/login" className="pill-button secondary small">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
