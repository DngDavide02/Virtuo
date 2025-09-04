import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../js/AuthContext";
import "../css/gameDetails.css";

function GameDetails() {
  const { id } = useParams();
  const { user, addToLibrary } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const API_BASE = "http://localhost:3001/api/games/rawg";
  const LIBRARY_API = "http://localhost:3001/api/library";

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE}/${id}`);
        setGame(data);
      } catch (err) {
        console.error("Error fetching game details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  const handleAddToLibrary = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to add games to your library.");
        return;
      }

      if (!user || user.role !== "USER") {
        alert("Only USERs can add games to their library.");
        return;
      }

      setAdding(true);

      await axios.post(
        `${LIBRARY_API}/${user.id}/add/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      addToLibrary({ id: game.id, name: game.name, background_image: game.background_image });
      alert("Game added to your library!");
    } catch (err) {
      console.error("Error adding game to library:", err);
      if (err.response?.status === 403) {
        alert("Access forbidden: check your token or role.");
      } else {
        alert("Failed to add game to library.");
      }
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="loader"></div>;
  if (!game) return <p>Game not found.</p>;

  return (
    <div className="container">
      <section className="game-hero-section">
        <div className="game-hero-image" style={{ backgroundImage: `url(${game.background_image || game.backgroundImage})` }}>
          <div className="game-hero-overlay"></div>
          <div className="game-hero-content">
            <h1>{game.name}</h1>
            {game.released && <p className="release-date">Released: {game.released}</p>}
            <div className="game-badges">
              {game.genres?.map((g) => (
                <span key={g.id} className="badge genre">
                  {g.name}
                </span>
              ))}
              {game.platforms?.map((p) => (
                <span key={p.platform.id} className="badge platform">
                  {p.platform.name}
                </span>
              ))}
            </div>
            {user?.role === "USER" && (
              <button className="btn-add-library" onClick={handleAddToLibrary} disabled={adding}>
                {adding ? "Adding..." : "Add to Library"}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="game-description-section">
        <h3 className="section-title">Description</h3>
        <p dangerouslySetInnerHTML={{ __html: game.description }} />
      </section>
    </div>
  );
}

export default GameDetails;
