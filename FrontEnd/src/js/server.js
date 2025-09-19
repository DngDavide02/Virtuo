import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors()); // Abilita CORS per consentire richieste dal frontend

/* 
  Endpoint proxy per recuperare la lista dei giochi da FreeToGame API.
  Viene utilizzato un proxy per evitare problemi di CORS lato client.
*/
app.get("/api/games", async (req, res) => {
  try {
    const response = await axios.get("https://www.freetogame.com/api/all"); // Richiesta verso API esterna
    res.json(response.data); // Restituisce i dati grezzi al frontend
  } catch (error) {
    res.status(500).json({ error: error.message }); // Gestione errore con status 500
  }
});

/* Avvio del server Express */
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
