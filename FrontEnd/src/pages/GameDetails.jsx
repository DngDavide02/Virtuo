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
        description: game.shortDescription || "No description available.",
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
          {game.releaseDate && <p className="release-date">Released: {game.releaseDate}</p>}
          <div className="game-badges">
            {game.genre && <span className="badge genre">{game.genre}</span>}
            {game.platform && <span className="badge platform">{game.platform}</span>}
          </div>
        </div>
      </section>

      <section className="game-description-section">
        <h2 className="section-title">Description</h2>
        <div className="game-description">{game.shortDescription || "No description available."}</div>
        <button onClick={handleAddToLibrary} className="pill-button primary" disabled={!user}>
          Add to Library
        </button>
        {error && <p className="error-message">{error}</p>}
      </section>
    </div>
  );
}
