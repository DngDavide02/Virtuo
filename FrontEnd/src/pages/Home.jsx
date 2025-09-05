import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../css/home.css";
import "../css/swiper.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper";

function Home() {
  const [carouselGames, setCarouselGames] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [_loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [pageSize, _setPageSize] = useState(12);
  const [page, setPage] = useState(1);

  const API_BASE = "http://localhost:3001/api";

  // Fetch carousel, top e upcoming
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const [carouselRes, topRes, upcomingRes] = await Promise.all([
          axios.get(`${API_BASE}/carousel`),
          axios.get(`${API_BASE}/top`),
          axios.get(`${API_BASE}/upcoming`),
        ]);

        setCarouselGames(carouselRes.data || []);
        setTopGames(topRes.data || []);
        setUpcomingGames(upcomingRes.data || []);
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  // Fetch allGames per Discover
  useEffect(() => {
    const fetchAllGames = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/all`, {
          params: {
            category: query || undefined,
            sortBy: sortBy !== "relevance" ? sortBy : undefined,
          },
        });
        setAllGames(res.data || []);
      } catch (err) {
        console.error("Error fetching discover games:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllGames();
  }, [query, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [query, sortBy, pageSize]);

  const getImage = (game) => game.thumbnail || "/img/default-game.jpg";
  const getName = (game) => game.title || "Unknown";
  const getReleased = (game) => game.releaseDate || "TBA";

  const filteredAndSorted = useMemo(() => {
    let list = allGames.slice();

    if (sortBy === "name-asc") list.sort((a, b) => getName(a).localeCompare(getName(b)));
    else if (sortBy === "name-desc") list.sort((a, b) => getName(b).localeCompare(getName(a)));
    else if (sortBy === "rating-desc") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "released-desc") list.sort((a, b) => new Date(getReleased(b)) - new Date(getReleased(a)));
    else if (sortBy === "released-asc") list.sort((a, b) => new Date(getReleased(a)) - new Date(getReleased(b)));

    return list;
  }, [allGames, sortBy]);

  const paginated = useMemo(() => filteredAndSorted.slice(0, page * pageSize), [filteredAndSorted, page, pageSize]);
  const hasMore = paginated.length < filteredAndSorted.length;

  const renderGameCard = (game) => (
    <div className="game-card large" key={game.id}>
      <div className="game-image-wrapper">
        <img src={getImage(game)} alt={getName(game)} loading="lazy" />
        <div className="card-overlay">
          <h4>{getName(game)}</h4>
          <div className="card-buttons">
            <Link to={`/games/${game.id}`} className="pill-button small no-link">
              View Details
            </Link>
          </div>
        </div>
      </div>
      <div className="game-footer">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: "white" }}>{getName(game)}</span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{getReleased(game)}</span>
        </div>
        <div className="rating">{(game.rating || 0).toFixed(1)}</div>
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
            <Link to="/games" className="pill-button primary">
              Browse Games
            </Link>
            <Link to="/about" className="pill-button secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="games-section fade-in">
        <h3 className="section-title">Featured Games</h3>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={4}
          slidesPerGroup={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            320: { slidesPerView: 1, slidesPerGroup: 1 },
            480: { slidesPerView: 2, slidesPerGroup: 2 },
            768: { slidesPerView: 3, slidesPerGroup: 3 },
            1024: { slidesPerView: 3, slidesPerGroup: 3 },
          }}
        >
          {carouselGames.slice(0, 15).map((game) => (
            <SwiperSlide key={game.id}>{renderGameCard(game)}</SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="games-section top-rated fade-in">
        <h3 className="section-title">Top Rated</h3>
        <div className="games-grid">{topGames.map(renderGameCard)}</div>
      </section>

      <section className="games-section upcoming fade-in">
        <h3 className="section-title">Coming Soon</h3>
        <div className="games-grid">{upcomingGames.map(renderGameCard)}</div>
      </section>

      <section className="games-section all-games fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <h3 className="section-title">Discover</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="search"
              placeholder="Search games..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
              style={{ flex: 1, minWidth: 150 }}
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="all-games-dropdown">
              <option value="relevance">Relevance</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="rating-desc">Rating High → Low</option>
              <option value="released-desc">Newest</option>
              <option value="released-asc">Oldest</option>
            </select>
          </div>
        </div>

        <div className="all-games-grid">{paginated.map(renderGameCard)}</div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 18, gap: 12 }}>
          {hasMore ? (
            <button onClick={() => setPage((p) => p + 1)} className="pill-button primary">
              Load more
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

export default Home;
