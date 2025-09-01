import axios from "axios";

const API_URL = "http://localhost:3001/api/auth";

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    const { token, username: user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("username", user);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: "Login failed" };
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: "Registration failed" };
  }
};
