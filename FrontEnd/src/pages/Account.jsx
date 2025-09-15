import React, { useEffect, useState } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import { useAuth } from "../js/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../css/account.css";

const API_BASE = "http://localhost:3001/api/library";

export default function Account() {
  const { user, logout } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.username) return;

    const fetchLibrary = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(API_BASE, {
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

  const goToDetails = (id) => navigate(`/games/${id}`);

  const removeGame = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGames((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <Container className="account-container" role="main">
      <div className="account-wrapper">
        {/* LEFT: account panel */}
        <aside className="account-panel" aria-label="Account info">
          <div className="account-avatar" aria-hidden>
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 className="account-name">{user.username}</h2>
          <p className="account-role">{user.role}</p>

          <div className="account-info">
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>

          <div className="account-buttons">
            {user.role === "ADMIN" && (
              <Link to="/admin">
                <Button variant="primary" className="btn-primary">
                  Admin
                </Button>
              </Link>
            )}
            <Button variant="outline-light" className="btn-logout" onClick={logout}>
              Logout
            </Button>
          </div>
        </aside>

        {/* RIGHT: library content */}
        <section className="account-content" aria-label="Library">
          <div className="library-header">
            <h3 className="library-title">My Library</h3>
            <div className="library-meta">
              <span className="library-count">
                {games.length} item{games.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="library-page-spinner">
              <Spinner animation="border" />
            </div>
          ) : games.length === 0 ? (
            <p className="library-empty">No games in your library.</p>
          ) : (
            <div className="library-grid">
              {games.map((game) => (
                <article key={game.id} className="library-card" aria-labelledby={`game-${game.id}-title`}>
                  <div className="library-card-img">
                    <img src={game.thumbnail} alt={game.title} loading="lazy" />
                  </div>
                  <div className="library-card-meta">
                    <h4 id={`game-${game.id}-title`} className="library-card-title" title={game.title}>
                      {game.title}
                    </h4>
                    <div className="library-card-sub">
                      <span className="library-card-release">{game.release_date}</span>
                    </div>
                    <div className="library-card-buttons">
                      <button onClick={() => goToDetails(game.id)} className="card-cta">
                        View
                      </button>
                      <button onClick={() => removeGame(game.id)} className="card-ghost">
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </Container>
  );
}
