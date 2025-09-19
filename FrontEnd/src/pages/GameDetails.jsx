import React, { useEffect, useState } from "react"; // import React e hook useState/useEffect
import { useParams } from "react-router-dom"; // per leggere l'id del gioco dall'URL
import axiosInstance from "../js/axiosInstance"; // instance di axios con token e config
import { useAuth } from "../js/AuthContext"; // context per utente e libreria
import "../css/gameDetails.css"; // CSS della pagina

export default function GameDetails() {
  const { id } = useParams(); // legge l'id del gioco dall'URL
  const [game, setGame] = useState(null); // stato per i dati del gioco
  const [error, setError] = useState(""); // stato per messaggi di errore
  const [success, setSuccess] = useState(""); // stato per messaggi di successo
  const [loading, setLoading] = useState(true); // stato loading
  const { user, addToLibrary } = useAuth(); // prende utente loggato e funzione per aggiornare la libreria

  // Effetto per recuperare i dati del gioco dall'API
  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true); // inizio loading
        console.log("[DEBUG] Fetching game with id:", id); // debug
        const res = await axiosInstance.get(`/games/${id}`);
        console.log("[DEBUG] Game data fetched:", res.data); // debug
        setGame(res.data); // salva i dati del gioco nello stato
      } catch (err) {
        console.error("[DEBUG] Error fetching game:", err); // log errore
        setError("Unable to fetch game data."); // mostra messaggio errore
      } finally {
        setLoading(false); // fine loading
      }
    };
    fetchGame();
  }, [id]);

  // Funzione per aggiungere il gioco alla libreria dell'utente
  const handleAddToLibrary = async () => {
    if (!user) {
      setError("You must be logged in to add games to your library."); // controlla login
      return;
    }

    try {
      setError(""); // reset errori
      setSuccess(""); // reset successo

      // Crea l'oggetto con i dati del gioco da salvare
      const gameDTO = {
        id: game.id,
        title: game.title,
        shortDescription: game.short_description || "No description available.",
        releaseDate: game.release_date,
        thumbnail: game.thumbnail,
        gameUrl: game.game_url || "",
        genre: game.genre || "",
        platform: game.platform || "",
        publisher: game.publisher || "",
        developer: game.developer || "",
        rating: game.rating || 0,
      };

      // Invio richiesta POST per aggiungere il gioco alla libreria
      const response = await axiosInstance.post("/library/add", gameDTO, {
        headers: { Authorization: `Bearer ${user.token}` },
        validateStatus: () => true, // evita throw automatico per status != 2xx
      });

      // Gestione delle risposte dal server
      switch (response.status) {
        case 200:
          addToLibrary(game); // aggiorna libreria locale
          setSuccess("Game added to your library!"); // messaggio successo
          break;
        case 409:
          setError("This game is already in your library."); // gioco già presente
          break;
        case 401:
          setError("You are not authorized. Please log in."); // non autorizzato
          break;
        default:
          setError("Failed to add game to library."); // errore generico
      }
    } catch (err) {
      console.error("[DEBUG] Unexpected error:", err); // log errore
      setError("An unexpected error occurred."); // messaggio errore generico
    }
  };

  // Spinner caricamento
  if (loading)
    return (
      <div className="home-spinner">
        <div className="spinner-circle"></div>
        <span className="text-white">Loading game...</span>
      </div>
    );

  if (!game) return <p>Game not found.</p>; // fallback se gioco non trovato

  return (
    <div className="game-details-container">
      {/* Hero section con immagine e overlay */}
      <section className="game-hero-section">
        <div
          className="game-hero-image"
          style={{
            backgroundImage: `url(${game.thumbnail || "https://via.placeholder.com/800x500"})`,
          }}
        ></div>
        <div className="game-hero-overlay"></div>
        <div className="game-hero-content">
          <h1 className="text-white">{game.title}</h1>
          <div className="game-badges">
            {game.genre && <span className="badge genre">{game.genre}</span>}
            {game.platform && <span className="badge platform">{game.platform}</span>}
          </div>
        </div>
      </section>

      {/* Sezione descrizione del gioco */}
      <section className="game-description-section">
        <h2 className="section-title">Description</h2>
        <div className="game-description mb-3">{game.short_description || "No description available."}</div>
        <button onClick={handleAddToLibrary} className="pill-button primary" disabled={!user}>
          Add to Library
        </button>
        {error && <p className="error-message">{error}</p>} {/* messaggi di errore */}
        {success && <p className="success-message">{success}</p>} {/* messaggi di successo */}
      </section>

      {/* Sezione informazioni aggiuntive del gioco */}
      <section className="game-info-section">
        <h2 className="section-title">Game Info</h2>
        <ul className="game-info-list">
          {game.release_date && (
            <li>
              <strong>Released:</strong> {game.release_date}
            </li>
          )}
          {game.genre && (
            <li>
              <strong>Genre:</strong> {game.genre}
            </li>
          )}
          {game.platform && (
            <li>
              <strong>Platform:</strong> {game.platform}
            </li>
          )}
          {game.publisher && (
            <li>
              <strong>Publisher:</strong> {game.publisher}
            </li>
          )}
          {game.developer && (
            <li>
              <strong>Developer:</strong> {game.developer}
            </li>
          )}
          {game.rating && (
            <li>
              <strong>Rating:</strong> {game.rating.toFixed(1)}
            </li>
          )}
          {game.game_url && (
            <li>
              <strong>Play:</strong>{" "}
              <a href={game.game_url} target="_blank" rel="noopener noreferrer">
                Open Game
              </a>
            </li>
          )}
          {game.freetogame_profile_url && (
            <li>
              <strong>Profile:</strong>{" "}
              <a href={game.freetogame_profile_url} target="_blank" rel="noopener noreferrer">
                Freetogame Page
              </a>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
