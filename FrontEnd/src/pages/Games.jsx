import React, { useEffect, useMemo, useState } from "react"; // React e hook
import { Link, useLocation } from "react-router-dom"; // Link per navigazione e useLocation per query params
import axiosInstance from "../js/axiosInstance"; // axios configurato
import "../css/home.css"; // CSS della pagina

function Games() {
  // Stati principali
  const [games, setGames] = useState([]); // lista giochi
  const [loading, setLoading] = useState(true); // loading spinner

  // Filtri e paginazione
  const [selectedCategory, setSelectedCategory] = useState(""); // filtro categoria
  const [selectedPlatform, setSelectedPlatform] = useState(""); // filtro piattaforma
  const [sortBy, setSortBy] = useState(""); // ordinamento
  const [page, setPage] = useState(1); // pagina corrente
  const [pageSize] = useState(12); // numero giochi per pagina

  const location = useLocation(); // prende l'URL
  const queryParams = new URLSearchParams(location.search); // parametri query
  const query = queryParams.get("search") || ""; // parametro di ricerca

  const categories = ["mmorpg", "shooter", "moba", "racing", "sports", "social", "sandbox", "open-world"];
  const platforms = ["pc", "browser"];

  // Effetto per fetch dei giochi dall'API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        let res;
        if (query) {
          // ricerca
          res = await axiosInstance.get("/games/search", { params: { q: query } });
        } else {
          // tutti i giochi
          res = await axiosInstance.get("/games");
        }
        setGames(res.data || []); // aggiorna lista giochi
      } catch (err) {
        console.error("Errore fetch giochi:", err);
      } finally {
        setLoading(false);
        setPage(1); // reset pagina a 1 ad ogni fetch
      }
    };
    fetchGames();
  }, [query]);

  // Filtraggio e ordinamento dei giochi
  const filteredAndSorted = useMemo(() => {
    let list = [...games];

    // filtro categoria
    if (selectedCategory) {
      list = list.filter((g) => g.genre?.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    // filtro piattaforma
    if (selectedPlatform) {
      list = list.filter((g) => {
        if (!g.platform) return false;
        return g.platform.toLowerCase().includes(selectedPlatform.toLowerCase());
      });
    }

    // ordinamento
    switch (sortBy) {
      case "alphabetical":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "release-date":
        list.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        break;
      default:
        break;
    }

    return list;
  }, [games, selectedCategory, selectedPlatform, sortBy]);

  // Paginazione
  const paginated = useMemo(() => filteredAndSorted.slice(0, page * pageSize), [filteredAndSorted, page, pageSize]);
  const hasMore = paginated.length < filteredAndSorted.length; // verifica se ci sono altri giochi

  const getImage = (game) => game.thumbnail || "/img/default-game.jpg"; // immagine di fallback

  if (loading)
    return (
      <div className="home-spinner">
        <div className="spinner-circle"></div>
        <span className="text-white">Loading games...</span>
      </div>
    );

  return (
    <div className="container">
      <section className="games-section all-games fade-in">
        {/* Filtri e selezioni */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12, alignItems: "center" }}>
          <h3 className="section-title" style={{ margin: 0 }}>
            All Games
          </h3>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="all-games-dropdown"
          >
            <option value="">Default</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="release-date">Release Date</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="all-games-dropdown"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedPlatform}
            onChange={(e) => {
              setSelectedPlatform(e.target.value);
              setPage(1);
            }}
            className="all-games-dropdown"
          >
            <option value="">All Platforms</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Conteggio risultati */}
        <div style={{ marginBottom: 10, color: "var(--muted)", fontSize: 13 }}>{filteredAndSorted.length} results</div>

        {/* Griglia dei giochi */}
        <div className="all-games-grid">
          {paginated.map((game) => (
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

        {/* Pulsanti Load More / Reset */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 18, gap: 12 }}>
          {hasMore ? (
            <button onClick={() => setPage((p) => p + 1)} className="pill-button primary">
              Load More
            </button>
          ) : (
            <button onClick={() => setPage(1)} className="pill-button secondary">
              Reset
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default Games;
