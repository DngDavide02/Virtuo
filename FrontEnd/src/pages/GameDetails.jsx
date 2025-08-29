import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/gameDetails.css";

function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:3001/api/games/rawg";

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/${id}`);
        setGame(res.data);
      } catch (err) {
        console.error("Error fetching game details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  if (loading) return <div className="loader"></div>;
  if (!game) return <p>Game not found.</p>;

  return (
    <div className="container">
      <section className="game-hero-section">
        <div className="game-hero-image" style={{ backgroundImage: `url(${game.background_image})` }}>
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
