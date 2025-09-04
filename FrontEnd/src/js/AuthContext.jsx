/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const addToLibrary = (game) => {
    if (!user) return;
    const updatedLibrary = [...(user.library || []), game];
    const updatedUser = { ...user, library: updatedLibrary };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const removeFromLibrary = (gameId) => {
    if (!user) return;
    const updatedLibrary = (user.library || []).filter((g) => g.id !== gameId);
    const updatedUser = { ...user, library: updatedLibrary };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return <AuthContext.Provider value={{ user, login, logout, addToLibrary, removeFromLibrary }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
