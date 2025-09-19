import axios from "axios";
import { getAuthHeader } from "./authService";

const API_BASE = "http://localhost:3001/api"; // Endpoint base per tutte le API

/* Crea un'istanza Axios preconfigurata per l'applicazione */
const api = axios.create({
  baseURL: API_BASE,
});

/* Interceptor: aggiunge automaticamente il token JWT (se presente) a ogni richiesta */
api.interceptors.request.use(
  (config) => {
    const headers = getAuthHeader();
    if (headers.Authorization) config.headers.Authorization = headers.Authorization;
    return config; // Config aggiornato con header di autenticazione
  },
  (error) => Promise.reject(error) // Gestione errori lato richiesta
);

export default api; // Esporta l'istanza Axios per uso centralizzato
