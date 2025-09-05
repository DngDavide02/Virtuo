import axios from "axios";

const API_BASE = "http://localhost:3001/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

// Interceptor per aggiungere automaticamente il token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // prende il token salvato
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
