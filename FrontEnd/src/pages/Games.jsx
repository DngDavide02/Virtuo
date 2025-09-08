import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../js/axiosInstance";
import "../css/home.css";

function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [sortBy, setSortBy] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("search") || "";

  const categories = ["mmorpg", "shooter", "moba", "racing", "sports", "social", "sandbox", "open-world"];
  const platforms = ["pc", "browser"];

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);

        let res;
        if (query) {
          res = await axiosInstance.get("/games/search", { params: { q: query } });
        } else {
          const params = {
            category: selectedCategory || undefined,
            platform: selectedPlatform || undefined,
            sortBy: sortBy || undefined,
          };
          res = await axiosInstance.get("/games", { params });
        }

        setGames(res.data || []);
      } catch (err) {
        console.error("Errore fetch giochi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [query, selectedCategory, selectedPlatform, sortBy]);

  const filteredAndSorted = useMemo(() => [...games], [games]);

  const getImage = (game) => game.thumbnail || "/img/default-game.jpg";

  if (loading) return <div className="loading">Loading games...</div>;

  return (
    <div className="container">
      <section className="games-section all-games fade-in">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12, alignItems: "center" }}>
          <h3 className="section-title" style={{ margin: 0 }}>
            All Games
          </h3>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="all-games-dropdown">
            <option value="">Default</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="release-date">Release Date</option>
          </select>

          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="all-games-dropdown">
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)} className="all-games-dropdown">
            <option value="">All Platforms</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 10, color: "var(--muted)", fontSize: 13 }}>{filteredAndSorted.length} results</div>

        <div className="all-games-grid">
          {filteredAndSorted.map((game) => (
            <div className="game-card large" key={game.id}>
              <div className="game-image-wrapper">
                <img src={getImage(game)} alt={game.title} loading="lazy" />
                <div className="card-overlay">
                  <h4>{game.title}</h4>
                  <div className="card-buttons">
                    <Link to={`/games/${game.id}`} className="pill-button small no-link">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
              <div className="game-footer">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "white" }}>{game.title}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{game.release_date ?? "TBA"}</span>
                </div>
                <div className="rating">{(game.rating || 0).toFixed(1)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Games;
