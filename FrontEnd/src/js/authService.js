import axios from "axios";

const API_URL = "http://localhost:3001/api/auth";

export const loginUser = async (username, password, loginFn) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    const { id, username: userName, role, token } = response.data;

    const userData = { id, username: userName, role, token };

    // aggiorna AuthContext e localStorage
    if (loginFn) loginFn(userData);

    return userData;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutUser = (logoutFn) => {
  if (logoutFn) logoutFn();
};

export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password });
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};
