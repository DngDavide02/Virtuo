import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../css/home.css";
import "../css/swiper.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper";

function Home() {
  const [carouselGames, setCarouselGames] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [_loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage] = useState(1);

  const API_BASE = "http://localhost:3001/api/games";

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const [carouselRes, topRes, upcomingRes, allRes] = await Promise.all([
          axios.get(`${API_BASE}/rawg?page=1&pageSize=12`),
          axios.get(`${API_BASE}/rawg/top-rated?page=1&pageSize=8`),
          axios.get(`${API_BASE}/rawg/coming-soon?page=1&pageSize=8`),
          axios.get(`${API_BASE}/rawg?page=1&pageSize=60`),
        ]);

        const carousel = carouselRes.data || [];
        const top = (topRes.data || []).filter((g) => !carousel.some((c) => c.id === g.id));
        const upcoming = (upcomingRes.data || []).filter((g) => !carousel.some((c) => c.id === g.id) && !top.some((t) => t.id === g.id));
        const all = (allRes.data || []).filter(
          (g) => !carousel.some((c) => c.id === g.id) && !top.some((t) => t.id === g.id) && !upcoming.some((u) => u.id === g.id)
        );

        setCarouselGames(carousel);
        setTopGames(top);
        setUpcomingGames(upcoming);
        setAllGames(all);
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, sortBy, pageSize]);

  const getImage = (game) => game.background_image || "/img/default-game.jpg";

  const filteredAndSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allGames.slice();

    if (q) {
      list = list.filter((g) => {
        const name = (g.name || "").toLowerCase();
        const genres = ((g.genres || []).map((x) => x.name).join(" ") || "").toLowerCase();
        const platforms = ((g.platforms || []).map((p) => p.platform?.name).join(" ") || "").toLowerCase();
        return name.includes(q) || genres.includes(q) || platforms.includes(q);
      });
    }

    if (sortBy === "name-asc") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "name-desc") {
      list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    } else if (sortBy === "rating-desc") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "released-desc") {
      list.sort((a, b) => {
        const da = a.released ? new Date(a.released).getTime() : 0;
        const db = b.released ? new Date(b.released).getTime() : 0;
        return db - da;
      });
    } else if (sortBy === "released-asc") {
      list.sort((a, b) => {
        const da = a.released ? new Date(a.released).getTime() : 0;
        const db = b.released ? new Date(b.released).getTime() : 0;
        return da - db;
      });
    }

    return list;
  }, [allGames, query, sortBy]);

  const paginated = useMemo(() => {
    const end = page * pageSize;
    return filteredAndSorted.slice(0, end);
  }, [filteredAndSorted, page, pageSize]);

  const hasMore = paginated.length < filteredAndSorted.length;

  const renderGameCard = (game) => (
    <div className={`game-card large`} key={game.id} tabIndex={0} aria-labelledby={`game-title-${game.id}`}>
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
      <section className="hero-section fade-in">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Welcome to Virtuo</h1>
          <p>Discover, explore, and play the best games from around the world. Your next adventure starts here.</p>
          <div className="hero-buttons">
            <button className="pill-button primary">Browse Store</button>
            <button className="pill-button secondary">Learn More</button>
          </div>
        </div>
      </section>

      <section className="games-section fade-in">
        <h3 className="section-title">Featured Games</h3>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={4}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 15 },
            480: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 25 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
          }}
        >
          {carouselGames.map((game) => (
            <SwiperSlide key={game.id}>{renderGameCard(game)}</SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="games-section top-rated fade-in">
        <h3 className="section-title">Top Rated</h3>
        <div className="games-grid">{topGames.map((game) => renderGameCard(game))}</div>
      </section>

      <section className="games-section upcoming fade-in">
        <h3 className="section-title">Coming Soon</h3>
        <div className="games-grid">{upcomingGames.map((game) => renderGameCard(game))}</div>
      </section>

      <section className="games-section all-games fade-in" aria-labelledby="all-games-heading">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <h3 id="all-games-heading" className="section-title" style={{ margin: 0 }}>
            All Games
          </h3>

          <div className="all-games-toolbar" style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
            <input
              type="search"
              placeholder="Search games, genres, platforms..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
              aria-label="Search games"
            />

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

export default Home;
