import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../js/axiosInstance";
import { useAuth } from "../js/AuthContext";
import "../css/gameDetails.css";

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user, addToLibrary } = useAuth();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        console.log("[DEBUG] Fetching game with id:", id);
        const res = await axiosInstance.get(`/games/${id}`);
        console.log("[DEBUG] Game data fetched:", res.data);
        setGame(res.data);
      } catch (err) {
        console.error("[DEBUG] Error fetching game:", err);
        setError("Unable to fetch game data.");
      }
    };
    fetchGame();
  }, [id]);

  const handleAddToLibrary = async () => {
    if (!user) {
      console.warn("[DEBUG] User not logged in");
      setError("You must be logged in to add games to your library.");
      return;
    }

    try {
      setError("");
      setSuccess("");

      console.log("[DEBUG] Current user:", user);
      console.log("[DEBUG] JWT token:", user.token);

      const gameDTO = {
        id: game.id,
        title: game.title,
        short_description: game.short_description || "No description available.",
        release_date: game.release_date,
        thumbnail: game.thumbnail,
        game_url: game.game_url || "",
        genre: game.genre || "",
        platform: game.platform || "",
        publisher: game.publisher || "",
        developer: game.developer || "",
        rating: game.rating || 0,
      };

      console.log("[DEBUG] Sending gameDTO to backend:", gameDTO);

      const response = await axiosInstance.post("/library/add", gameDTO, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      console.log("[DEBUG] Backend response:", response);

      addToLibrary(game);
      setSuccess("Game added to your library!");
    } catch (err) {
      console.error("[DEBUG] Error adding game to library:", err.response || err);
      setError("Failed to add game to library.");
    }
  };

  if (!game) return <p>Loading...</p>;

  return (
    <div className="game-details-container">
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

      <section className="game-description-section">
        <h2 className="section-title">Description</h2>
        <div className="game-description mb-3">{game.short_description || "No description available."}</div>
        <button onClick={handleAddToLibrary} className="pill-button primary" disabled={!user}>
          Add to Library
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </section>

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
