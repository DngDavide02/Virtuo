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
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/rawg/games/${id}`);
      setGame(res.data);
    } catch (err) {
      console.error("Error fetching game:", err);
      setError("Unable to fetch game data.");
    }
  };

  const handleAddToLibrary = async () => {
    if (!user) {
      setError("You must be logged in to add games to your library.");
      return;
    }
    try {
      await axios.post(
        `http://localhost:3001/api/library/${user.id}/add/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      addToLibrary({ id: id, name: game.name });
    } catch (err) {
      console.error("Error adding game to library:", err);
      setError("Failed to add game to library.");
    }
  };

  if (!game) return <p>Loading...</p>;

  return (
    <div className="game-details-container">
      <h1>{game.name}</h1>
      <img src={game.background_image} alt={game.name} />
      <p>{game.description_raw}</p>
      <button onClick={handleAddToLibrary} className="pill-button primary">
        Add to Library
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
