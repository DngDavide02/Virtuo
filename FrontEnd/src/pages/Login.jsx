import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/login.css";
import { loginUser } from "../js/authService";
import { useAuth } from "../js/AuthContext";

function Login() {
  // Local state for form inputs and error messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // for post-login redirect
  const { login } = useAuth(); // login function from context

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // prevent page reload
    setError(""); // reset error

    try {
      // loginUser sends request to backend and passes login callback to update context
      const _res = await loginUser(username, password, login);

      navigate("/"); // redirect to home after login
    } catch (err) {
      // show error if login fails
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Virtuo</h2>
        <form onSubmit={handleLogin}>
          {/* Username input */}
          <label htmlFor="username">Username</label>
          <input type="text" id="username" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)} required />

          {/* Password input */}
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {/* Submit button */}
          <button type="submit" className="pill-button primary">
            Login
          </button>

          {/* Error message */}
          {error && <p className="error-message">{error}</p>}
        </form>

        {/* Footer with registration link */}
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
