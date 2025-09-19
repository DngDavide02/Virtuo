import { useState, useEffect } from "react";

/* Custom hook per gestire autenticazione lato client */
export function useAuth() {
  const [user, setUser] = useState(null); // Stato locale per utente autenticato

  /* Recupera username dal localStorage al primo render */
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUser(storedUsername); // Aggiorna stato se utente già loggato
    }
  }, []);

  /* Funzione di login: salva username in localStorage e aggiorna stato */
  const login = (username) => {
    localStorage.setItem("username", username);
    setUser(username);
  };

  /* Funzione di logout: rimuove dati locali e resetta stato */
  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUser(null);
  };

  /* Restituisce stato utente e funzioni di login/logout */
  return { user, login, logout };
}
