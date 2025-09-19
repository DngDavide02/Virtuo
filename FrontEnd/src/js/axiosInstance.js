import axios from "axios";

const API_BASE = "http://localhost:3001/api"; // Endpoint base per tutte le chiamate API

/* Crea un'istanza Axios preconfigurata con baseURL */
const axiosInstance = axios.create({
  baseURL: API_BASE,
});

/* Interceptor REQUEST: aggiunge automaticamente il token JWT (se presente) a ogni richiesta */
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // Config aggiornato con eventuale header di autorizzazione
});

/* Interceptor RESPONSE: intercetta errori 401 (token scaduto o non valido) */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Reset dati locali e redirect alla pagina di login
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.replace("/login");
    }
    return Promise.reject(error); // Propaga l'errore per gestione superiore
  }
);

export default axiosInstance; // Istanza Axios centralizzata per l’app
