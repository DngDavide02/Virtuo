import React, { useState } from "react"; // React e hook useState
import { Link, useNavigate } from "react-router-dom"; // Link per navigazione interna, useNavigate per redirect
import "../css/login.css"; // Stili login
import { loginUser } from "../js/authService"; // Funzione per effettuare login
import { useAuth } from "../js/AuthContext"; // Contesto auth

function Login() {
  // Stati locali per input e messaggi di errore
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // per redirect post-login
  const { login } = useAuth(); // funzione login dal contesto

  // Gestione submit form
  const handleLogin = async (e) => {
    e.preventDefault(); // previene reload pagina
    setError(""); // reset errore

    try {
      // loginUser invia richiesta al backend e passa il callback login per aggiornare il contesto
      const _res = await loginUser(username, password, login);

      navigate("/"); // redirect a home dopo login
    } catch (err) {
      // mostra errore se fallisce
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Virtuo</h2>
        <form onSubmit={handleLogin}>
          {/* Input username */}
          <label htmlFor="username">Username</label>
          <input type="text" id="username" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)} required />

          {/* Input password */}
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {/* Pulsante submit */}
          <button type="submit" className="pill-button primary">
            Login
          </button>

          {/* Messaggio di errore */}
          {error && <p className="error-message">{error}</p>}
        </form>

        {/* Footer con link alla registrazione */}
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

export default Login; // esporta componente
