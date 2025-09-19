import React, { useEffect, useMemo, useState } from "react"; // React e hook
import { Link } from "react-router-dom"; // Link per navigazione interna
import axiosInstance from "../js/axiosInstance"; // Axios preconfigurato

import "../css/home.css"; // Stili principali
import "../css/swiper.css"; // Stili Swiper carousel

import { Swiper, SwiperSlide } from "swiper/react"; // Swiper per carousel
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper"; // Moduli Swiper

function Home() {
  // Stati principali
  const [carouselGames, setCarouselGames] = useState([]); // Giochi per il carousel in home
  const [topGames, setTopGames] = useState([]); // Giochi top rated
  const [allGames, setAllGames] = useState([]); // Tutti i giochi
  const [loading, setLoading] = useState(true); // Spinner caricamento

  const [query, setQuery] = useState(""); // Ricerca giochi
  const [sortBy, setSortBy] = useState("relevance"); // Ordinamento giochi
  const [pageSize] = useState(12); // Numero giochi per pagina
  const [page, setPage] = useState(1); // Pagina corrente

  // Fetch dei giochi al mount del componente
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/games");
        const games = res.data || [];

        // Imposta carousel limitando il numero di giochi in base alla larghezza dello schermo
        const maxCarouselItems = window.innerWidth < 768 ? 6 : 15;
        setCarouselGames(games.slice(0, maxCarouselItems));

        // Giochi top rated ordinati per rating
        setTopGames([...games].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 12));

        // Tutti i giochi per la sezione "Discover"
        setAllGames(games);
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  // Filtraggio e ordinamento giochi per Discover
  const filteredAndSorted = useMemo(() => {
    let list = allGames.slice();
    if (query) {
      list = list.filter((g) => g.title.toLowerCase().includes(query.toLowerCase())); // filtro ricerca
    }
    switch (sortBy) {
      case "name-asc":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating-desc":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "released-desc":
        list.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        break;
      case "released-asc":
        list.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        break;
      default:
        break;
    }
    return list;
  }, [allGames, query, sortBy]);

  // Paginazione
  const paginated = useMemo(() => filteredAndSorted.slice(0, page * pageSize), [filteredAndSorted, page, pageSize]);
  const hasMore = paginated.length < filteredAndSorted.length;

  // Funzione helper per rendere le card dei giochi
  const renderGameCard = (game) => (
    <div className="game-card large" key={game.id}>
      <div className="game-image-wrapper">
        <img src={game.thumbnail || "/img/default-game.jpg"} alt={game.title || "Unknown"} loading="lazy" />
        <div className="card-overlay">
          <h4>{game.title || "Unknown"}</h4>
          <div className="card-buttons">
            <Link to={`/games/${game.id}`} className="pill-button small no-link">
              View Details
            </Link>
          </div>
        </div>
      </div>
      <div className="game-footer">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: "white" }}>{game.title || "Unknown"}</span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{game.release_date || "TBA"}</span>
        </div>
        <div className="rating">{(game.rating || 0).toFixed(1)}</div>
      </div>
    </div>
  );

  // Spinner caricamento
  if (loading)
    return (
      <div className="home-spinner">
        <div className="spinner-circle"></div>
        <span className="text-white">Loading games...</span>
      </div>
    );

  return (
    <div className="container">
      {/* Hero Section */}
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

      {/* Carousel Featured Games */}
      <section className="games-section fade-in">
        <h3 className="section-title">Featured Games</h3>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerGroup={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            480: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
            1440: { slidesPerView: 5 },
          }}
        >
          {carouselGames.map((game) => (
            <SwiperSlide key={game.id}>{renderGameCard(game)}</SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Top Rated Section */}
      <section className="games-section top-rated fade-in">
        <h3 className="section-title">Top Rated</h3>
        <div className="games-grid">{topGames.map(renderGameCard)}</div>
      </section>

      {/* Discover / All Games Section */}
      <section className="games-section all-games fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <h3 className="section-title">Discover</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Ricerca */}
            <input
              type="search"
              placeholder="Search games..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
              style={{ flex: 1, minWidth: 150 }}
            />
            {/* Ordinamento */}
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
        {/* Griglia giochi paginata */}
        <div className="all-games-grid">{paginated.map(renderGameCard)}</div>
        {/* Pulsanti Load More / Reset */}
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

export default Home; // Esporta il componente
