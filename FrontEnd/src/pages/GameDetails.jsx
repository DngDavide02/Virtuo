import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../js/axiosInstance";
import { useAuth } from "../js/AuthContext";
import "../css/gameDetails.css";

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [error, setError] = useState("");
  const { user, addToLibrary } = useAuth();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await axiosInstance.get(`/games/${id}`);
        setGame(res.data);
      } catch (err) {
        console.error("Error fetching game:", err);
        setError("Unable to fetch game data.");
      }
    };
    fetchGame();
  }, [id]);

  const handleAddToLibrary = async () => {
    if (!user) {
      setError("You must be logged in to add games to your library.");
      return;
    }

    try {
      const gameDTO = {
        id: game.id,
        name: game.title,
        description: game.short_description || "No description available.",
        released: game.release_date,
        backgroundImage: game.thumbnail,
        rating: game.rating || 0,
      };

      await axiosInstance.post(`/library/add`, gameDTO, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      addToLibrary(gameDTO);
    } catch (err) {
      console.error("Error adding game to library:", err);
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
          <h1>{game.title}</h1>
          <div className="game-badges">
            {game.genre && <span className="badge genre">{game.genre}</span>}
            {game.platform && <span className="badge platform">{game.platform}</span>}
          </div>
        </div>
      </section>

      <section className="game-description-section">
        <h2 className="section-title">Description</h2>
        <div className="game-description">{game.short_description || "No description available."}</div>
        <button onClick={handleAddToLibrary} className="pill-button primary" disabled={!user}>
          Add to Library
        </button>
        {error && <p className="error-message">{error}</p>}
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
              <a href={game.game_url} target="_blank">
                Open Game
              </a>
            </li>
          )}
          {game.freetogame_profile_url && (
            <li>
              <strong>Profile:</strong>{" "}
              <a href={game.freetogame_profile_url} target="_blank">
                Freetogame Page
              </a>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
