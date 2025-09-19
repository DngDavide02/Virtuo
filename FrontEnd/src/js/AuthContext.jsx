/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

/* Creazione del contesto globale per gestire auth e libreria */
const AuthContext = createContext();

/* Provider che incapsula l'app e rende disponibili i dati di auth */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Stato utente autenticato
  const [library, setLibrary] = useState([]); // Stato libreria giochi

  /* Recupero dati salvati da localStorage al primo render */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedLibrary = localStorage.getItem("library");
    if (storedLibrary) setLibrary(JSON.parse(storedLibrary));
  }, []);

  /* Login: salva utente e token in localStorage + aggiorna stato */
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    setUser(userData);
  };

  /* Logout: rimuove dati da localStorage e resetta stato */
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("library");
    setUser(null);
    setLibrary([]);
  };

  /* Aggiunge un gioco alla libreria evitando duplicati */
  const addToLibrary = (game) => {
    if (!library.some((g) => g.id === game.id)) {
      const updated = [...library, game];
      setLibrary(updated);
      localStorage.setItem("library", JSON.stringify(updated));
    }
  };

  /* Rimuove un gioco dalla libreria tramite id */
  const removeFromLibrary = (gameId) => {
    const updated = library.filter((g) => g.id !== gameId);
    setLibrary(updated);
    localStorage.setItem("library", JSON.stringify(updated));
  };

  /* Espone valori e funzioni a tutta l'app */
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        library,
        addToLibrary,
        removeFromLibrary,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* Custom hook per usare facilmente il contesto */
export function useAuth() {
  return useContext(AuthContext);
}
