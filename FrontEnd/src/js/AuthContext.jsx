/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedLibrary = localStorage.getItem("library");
    if (storedLibrary) setLibrary(JSON.parse(storedLibrary));
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("library");
    setUser(null);
    setLibrary([]);
  };

  const addToLibrary = (game) => {
    if (!library.some((g) => g.id === game.id)) {
      const updated = [...library, game];
      setLibrary(updated);
      localStorage.setItem("library", JSON.stringify(updated));
    }
  };

  const removeFromLibrary = (gameId) => {
    const updated = library.filter((g) => g.id !== gameId);
    setLibrary(updated);
    localStorage.setItem("library", JSON.stringify(updated));
  };

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

export function useAuth() {
  return useContext(AuthContext);
}
