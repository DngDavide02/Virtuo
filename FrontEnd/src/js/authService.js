import axios from "axios";

const API_URL = "http://localhost:3001/api/auth"; // Endpoint base per le API di autenticazione

/* Effettua il login, salva i dati utente e aggiorna AuthContext/localStorage */
export const loginUser = async (username, password, loginFn) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    const { id, username: userName, role, token } = response.data;

    const userData = { id, username: userName, role, token };

    // Aggiorna lo stato globale tramite funzione passata dal contesto
    if (loginFn) loginFn(userData);

    return userData; // Restituisce i dati utente autenticato
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Propaga l’errore per gestione a livello superiore
  }
};

/* Esegue il logout tramite funzione del contesto (reset stato + storage) */
export const logoutUser = (logoutFn) => {
  if (logoutFn) logoutFn();
};

/* Restituisce header di autorizzazione con token JWT */
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
};

/* Effettua la registrazione di un nuovo utente */
export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password });
    return response.data; // Dati restituiti dal backend dopo registrazione
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};
