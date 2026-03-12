import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../js/axiosInstance";

// Import specific CSS files for the component and Swiper
import "../css/home.css";
import "../css/swiper.css";

// Import Swiper React modules and related styles
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper";

// Import background image for hero section
import heroBackground from "../assets/hero.jpg";

/**
 * Main Home component that handles homepage rendering.
 * Manages game data fetching, state management, filtering, sorting,
 * and rendering of various sections.
 */
function Home() {
  // Main component state declarations
  const [carouselGames, setCarouselGames] = useState([]); // Games for carousel
  const [topGames, setTopGames] = useState([]); // Games for "Top Rated" section
  const [allGames, setAllGames] = useState([]); // All available games
  const [spotlightGame, setSpotlightGame] = useState(null); // Featured game for spotlight section
  const [loading, setLoading] = useState(true); // Loading state for UI

  // State for search and sorting functionality
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [pageSize] = useState(12); // Number of games per page
  const [page, setPage] = useState(1); // Current page for "Load more"

  /**
   * useEffect hook for fetching data on component mount.
   * Empty dependency array [] ensures it runs only once.
   */
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/games");
        const games = res.data || [];

        // Set games for carousel, limiting number based on screen width
        const maxCarouselItems = window.innerWidth < 768 ? 6 : 15;
        setCarouselGames(games.slice(0, maxCarouselItems));

        // Sort games by rating and set for "Top Rated" section
        const sortedByRating = [...games].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setTopGames(sortedByRating.slice(0, 12));
        // Select highest rated game for spotlight section
        setSpotlightGame(sortedByRating[0]);

        // Set all games for "Discover" sections
        setAllGames(games);
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  /**
   * useMemo hook for optimizing game filtering and sorting.
   * Recalculates list only when `allGames`, `query`, or `sortBy` change.
   */
  const filteredAndSorted = useMemo(() => {
    let list = allGames.slice();
    if (query) {
      list = list.filter((g) => g.title.toLowerCase().includes(query.toLowerCase()));
    }
    // Sorting logic based on `sortBy` value
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

  /**
   * useMemo hook for pagination, based on filtered and sorted list.
   * Returns only games to display on current page.
   */
  const paginated = useMemo(() => filteredAndSorted.slice(0, page * pageSize), [filteredAndSorted, page, pageSize]);
  const hasMore = paginated.length < filteredAndSorted.length;

  /**
   * Rendering function for a single game card.
   * Used to avoid markup code duplication.
   * @param {object} game - Game object to render.
   */
  const renderGameCard = (game) => (
    <div className="game-card large" key={game.id}>
      <div className="game-image-wrapper">
        <img src={game.thumbnail || "/img/default-game.jpg"} alt={game.title || "Unknown"} loading="lazy" />
        {game.platforms && game.platforms.length > 0 && <span className="card-badge">{game.platforms[0].name}</span>}
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

  // Show loading animation if data hasn't been loaded yet
  if (loading)
    return (
      <div className="home-spinner">
        <div className="spinner-circle"></div>
        <span className="text-white">Loading games...</span>
      </div>
    );

  /**
   * Main JSX structure of the component.
   */
  return (
    <>
      {/* Hero Section - Dynamic background */}
      <section className="hero-section fade-in" style={{ backgroundImage: `url(${heroBackground})` }}>
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

      <div className="container">
        {/* Featured Games Section (Swiper Carousel) */}
        <section className="games-section fade-in">
          <h3 className="section-title">Featured Games</h3>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={5}
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

        {/* "Top Rated" Section */}
        <section className="games-section top-rated fade-in">
          <h3 className="section-title">Top Rated</h3>
          <div className="games-grid">{topGames.map(renderGameCard)}</div>
        </section>

        {/* Spotlight Section */}
        {spotlightGame && (
          <section className="spotlight-section" style={{ backgroundImage: `url(${spotlightGame.background_image || spotlightGame.thumbnail})` }}>
            <div className="spotlight-content">
              <div className="spotlight-text">
                <h4>Spotlight Game</h4>
                <h3>{spotlightGame.title}</h3>
                <p>
                  {spotlightGame.description ||
                    "Experience the future of action-RPG with stunning visuals and a captivating storyline. Explore a vast open world, forge alliances, and decide the fate of a shattered realm."}
                </p>
                <Link to={`/games/${spotlightGame.id}`} className="pill-button primary">
                  View Details
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* "Discover" Section with search, sorting, and pagination */}
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
            {/* "Load more" or "Reset" button based on pagination state */}
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
    </>
  );
}

export default Home;
