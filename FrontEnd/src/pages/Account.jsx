import React, { useEffect, useState, useMemo } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import { useAuth } from "../js/AuthContext";
import axiosInstance from "../js/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import "../css/account.css";

export default function Account() {
  const { user, logout } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genreFilter, setGenreFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.username) return;

    const fetchLibrary = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/library");
        setGames(res.data || []);
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
      await axiosInstance.delete(`/library/remove/${id}`);
      setGames((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const genreMatch = !genreFilter || (game.genre && game.genre.toLowerCase() === genreFilter.toLowerCase());
      const platformMatch = !platformFilter || (game.platform && game.platform.toLowerCase() === platformFilter.toLowerCase());
      return genreMatch && platformMatch;
    });
  }, [games, genreFilter, platformFilter]);

  if (!user) return <p>Loading...</p>;

  const genres = Array.from(new Set(games.map((g) => g.genre).filter(Boolean)));
  const platforms = Array.from(new Set(games.map((g) => g.platform).filter(Boolean)));

  return (
    <Container className="account-container" role="main">
      <div className="account-wrapper">
        {/* PANEL */}
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

        {/* CONTENT */}
        <section className="account-content" aria-label="Library">
          <div className="library-header">
            <h3 className="library-title">My Library</h3>
            <div className="library-meta">
              <span className="library-count">
                {filteredGames.length} item{filteredGames.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* FILTRI */}
          <div className="library-filters">
            <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
              <option value="">All Platforms</option>
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* LOADING / EMPTY / GRID */}
          {loading ? (
            <div className="library-page-spinner">
              <Spinner animation="border" />
            </div>
          ) : filteredGames.length === 0 ? (
            <p className="library-empty">No games match your filters.</p>
          ) : (
            <div className="library-grid">
              {filteredGames.map((game) => (
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
