import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
        const res = await axios.get(`http://localhost:3001/api/games/${id}`);
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
        name: game.name,
        description: game.description || game.description_raw || "",
        released: game.released,
        backgroundImage: game.backgroundImage || game.background_image,
        rating: game.rating || 0,
      };

      await axios.post(`http://localhost:3001/api/library/add`, gameDTO, {
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
            backgroundImage: `url(${game.backgroundImage || game.background_image || "https://via.placeholder.com/800x500"})`,
          }}
        ></div>
        <div className="game-hero-overlay"></div>
        <div className="game-hero-content">
          <h1>{game.name}</h1>
          {game.released && <p className="release-date">Released: {game.released}</p>}
          {game.genres && game.genres.length > 0 && (
            <div className="game-badges">
              {game.genres.map((genre) => (
                <span key={genre.id} className="badge genre">
                  {genre.name}
                </span>
              ))}
            </div>
          )}
          {game.platforms && game.platforms.length > 0 && (
            <div className="game-badges">
              {game.platforms.map((plat) => (
                <span key={plat.platform.id} className="badge platform">
                  {plat.platform.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="game-description-section">
        <h2 className="section-title">Description</h2>
        <div className="game-description" dangerouslySetInnerHTML={{ __html: game.description || game.description_raw || "No description available." }}></div>
        <button onClick={handleAddToLibrary} className="pill-button primary">
          Add to Library
        </button>
        {error && <p className="error-message">{error}</p>}
      </section>
    </div>
  );
}
