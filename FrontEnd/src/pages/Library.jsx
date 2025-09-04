import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../js/AuthContext";
import "../css/library.css";

function Library() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const API_BASE = "http://localhost:3001/api/library";

  useEffect(() => {
    const fetchLibrary = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGames(res.data);
      } catch (err) {
        console.error("Error fetching library:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, [user]);

  const handleRemoveGame = async (gameId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/${user.id}/remove/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGames((prev) => prev.filter((g) => g.id !== gameId));
    } catch (err) {
      console.error("Error removing game:", err);
      alert("Failed to remove game.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="loader"></div>;
  if (games.length === 0) return <p>Your library is empty.</p>;

  return (
    <div className="library-container">
      <h2>Your Library</h2>
      <div className="game-grid">
        {games.map((game) => (
          <div key={game.id} className="game-card">
            <img src={game.background_image} alt={game.name} />
            <h3>{game.name}</h3>
            <p>Released: {game.released}</p>
            <button onClick={() => handleRemoveGame(game.id)} disabled={actionLoading} className="btn-remove">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Library;
