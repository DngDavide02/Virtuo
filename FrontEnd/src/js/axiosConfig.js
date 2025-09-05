import axios from "axios";
import { getAuthHeader } from "./authService";

const API_BASE = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(
  (config) => {
    const headers = getAuthHeader();
    if (headers.Authorization) config.headers.Authorization = headers.Authorization;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
