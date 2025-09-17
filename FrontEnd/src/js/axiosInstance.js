import axios from "axios";

const API_BASE = "http://localhost:3001/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

// Interceptor per aggiungere automaticamente il token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor per gestire errori 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token scaduto o non valido
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
