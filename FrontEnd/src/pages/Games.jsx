import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "../css/home.css";

function Games() {
  const [games, setGames] = useState([]);
  const [_loading, setLoading] = useState(true);

  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [years, setYears] = useState([]);

  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage] = useState(1);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("search") || "";

  const API_BASE = "http://localhost:3001/api/games/rawg/filter";

  // Fetch generi e piattaforme
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [genresRes, platformsRes] = await Promise.all([
          axios.get("http://localhost:3001/api/games/genres"),
          axios.get("http://localhost:3001/api/games/platforms"),
        ]);
        setGenres(genresRes.data || []);
        setPlatforms(platformsRes.data || []);
      } catch (err) {
        console.error("Errore fetch filtri:", err);
      }
    };
    fetchFilters();
  }, []);

  // Fetch giochi con filtri
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: 1,
          pageSize: 100,
        });
        if (query) params.append("search", query);
        if (selectedGenre) params.append("genres", selectedGenre);
        if (selectedPlatform) params.append("platforms", selectedPlatform);
        if (selectedYear) params.append("year", selectedYear);
        if (sortBy && sortBy !== "relevance") params.append("ordering", sortBy);

        const res = await axios.get(`${API_BASE}?${params.toString()}`);
        const gamesData = res.data || [];
        setGames(gamesData);

        // Calcolo anni disponibili dai giochi (fino al 2025)
        const yearsSet = new Set();
        gamesData.forEach((g) => {
          if (g.released) {
            const year = new Date(g.released).getFullYear();
            if (year <= 2025) yearsSet.add(year);
          }
        });
        setYears(Array.from(yearsSet).sort((a, b) => b - a));
      } catch (err) {
        console.error("Errore fetch giochi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [query, selectedGenre, selectedPlatform, selectedYear, sortBy]);

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

  const getImage = (game) => game.background_image || "/img/default-game.jpg";

  return (
    <div className="container">
      <section className="games-section all-games fade-in">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12, alignItems: "center" }}>
          <h3 className="section-title" style={{ margin: 0 }}>
            All Games
          </h3>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="all-games-dropdown">
            <option value="relevance">Relevance</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="rating-desc">Rating (High → Low)</option>
            <option value="released-desc">Newest</option>
            <option value="released-asc">Oldest</option>
          </select>

          <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="all-games-dropdown">
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>

          <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="all-games-dropdown">
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>

          <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)} className="all-games-dropdown">
            <option value="">All Platforms</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="all-games-dropdown">
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 10, color: "var(--muted)", fontSize: 13 }}>
          {filteredAndSorted.length} results · Showing {paginated.length} of {filteredAndSorted.length}
        </div>

        <div className="all-games-grid">
          {paginated.map((game) => (
            <div className="game-card large" key={game.id}>
              <div className="game-image-wrapper">
                <img src={getImage(game)} alt={game.name} loading="lazy" />
                <div className="card-overlay">
                  <h4>{game.name}</h4>
                  <div className="card-buttons">
                    <Link to={`/games/${game.id}`} className="pill-button small no-link">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
              <div className="game-footer">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "white" }}>{game.name}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{game.released ?? "TBA"}</span>
                </div>
                <div className="rating">{(game.rating || 0).toFixed(1)}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 18, gap: 12 }}>
          {hasMore ? (
            <button onClick={() => setPage((p) => p + 1)} className="pill-button primary">
              Load more
            </button>
          ) : (
            <button
              onClick={() => {
                setPage(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="pill-button secondary"
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
