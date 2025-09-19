import React, { useState } from "react"; // React e useState
import { Link, useNavigate } from "react-router-dom"; // Link per navigazione, useNavigate per redirect
import "../css/login.css"; // stili del form
import { registerUser } from "../js/authService"; // funzione per registrazione

function Register() {
  // Stati locali per input e messaggi
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // per redirect post-registrazione

  // Gestione submit form
  const handleRegister = async (e) => {
    e.preventDefault(); // previene reload
    setError(""); // reset messaggi
    setSuccess("");

    try {
      // chiamata al backend per registrare utente
      const res = await registerUser(username, email, password);
      setSuccess(res); // messaggio di successo
      setTimeout(() => navigate("/login"), 1500); // redirect a login dopo 1.5s
    } catch (err) {
      // messaggio errore
      setError(err.error || "Registration failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Register to Virtuo</h2>
        <form onSubmit={handleRegister}>
          {/* Input username */}
          <label htmlFor="username">Username</label>
          <input type="text" id="username" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)} required />

          {/* Input email */}
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

          {/* Input password */}
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {/* Pulsante submit */}
          <button type="submit" className="pill-button primary">
            Register
          </button>

          {/* Messaggi di errore o successo */}
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form>

        {/* Footer con link a login */}
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

export default Register; // esporta componente
