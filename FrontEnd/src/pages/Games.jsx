import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "../css/home.css";

function Games() {
  const [games, setGames] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage] = useState(1);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("search") || "";

  const API_BASE = "http://localhost:3001/api/games";

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/rawg?page=1&pageSize=60${query ? `&search=${query}` : ""}`);
        setGames(res.data || []);
      } catch (err) {
        console.error("Errore nel fetch dei giochi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [query]);

  useEffect(() => setPage(1), [sortBy, pageSize, query]);

  const getImage = (game) => game.background_image || "/img/default-game.jpg";

  const filteredAndSorted = useMemo(() => {
    let list = [...games];

    switch (sortBy) {
      case "name-asc":
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-desc":
        list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "rating-desc":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "released-desc":
        list.sort((a, b) => new Date(b.released || 0) - new Date(a.released || 0));
        break;
      case "released-asc":
        list.sort((a, b) => new Date(a.released || 0) - new Date(b.released || 0));
        break;
      default:
        break;
    }
    return list;
  }, [games, sortBy]);

  const paginated = useMemo(() => filteredAndSorted.slice(0, page * pageSize), [filteredAndSorted, page, pageSize]);
  const hasMore = paginated.length < filteredAndSorted.length;

  const renderGameCard = (game) => (
    <div className="game-card large" key={game.id} tabIndex={0} aria-labelledby={`game-title-${game.id}`}>
      <div className="game-image-wrapper">
        <img src={getImage(game)} alt={game.name} loading="lazy" />
        <div className="card-overlay">
          <h4 id={`game-title-${game.id}`}>{game.name}</h4>
          <div className="card-buttons">
            <Link to={`/games/${game.id}`} className="pill-button small no-link" aria-label={`View details for ${game.name}`}>
              View Details
            </Link>
          </div>
        </div>
      </div>
      <div className="game-footer">
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: "white" }}>{game.name}</span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{game.released ?? "TBA"}</span>
          </div>
        </div>
        <div className="rating" aria-hidden="true">
          {(game.rating || 0).toFixed(1)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <section className="games-section all-games fade-in" aria-labelledby="all-games-heading">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <h3 id="all-games-heading" className="section-title" style={{ margin: 0 }}>
            All Games
          </h3>

          <div className="all-games-toolbar" style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
            <div className="all-games-dropdown-wrapper">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="all-games-dropdown" aria-label="Sort games">
                <option value="relevance">Relevance</option>
                <option value="name-asc">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
                <option value="rating-desc">Rating (High → Low)</option>
                <option value="released-desc">Newest</option>
                <option value="released-asc">Oldest</option>
              </select>
            </div>

            <div className="all-games-dropdown-wrapper">
              <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="all-games-dropdown" aria-label="Items per page">
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 10, color: "var(--muted)", fontSize: 13 }}>
          {filteredAndSorted.length} result{filteredAndSorted.length !== 1 ? "s" : ""} · Showing {paginated.length} of {filteredAndSorted.length}
        </div>

        <div className="all-games-grid">{paginated.map((game) => renderGameCard(game))}</div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 18, gap: 12 }}>
          {hasMore ? (
            <button onClick={() => setPage((p) => p + 1)} className="pill-button primary" aria-label="Load more games">
              Load more
            </button>
          ) : (
            <button
              onClick={() => {
                setPage(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="pill-button secondary"
              aria-label="Reset pagination"
            >
              Reset
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default Games;
