import React, { useEffect, useState } from "react";
import axios from "axios";

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
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:3001/api/games";

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const [carouselRes, topRes, upcomingRes, allRes] = await Promise.all([
          axios.get(`${API_BASE}/rawg/featured?page=1&pageSize=12`),
          axios.get(`${API_BASE}/rawg/top-rated?page=1&pageSize=8`),
          axios.get(`${API_BASE}/rawg/coming-soon?page=1&pageSize=8`),
          axios.get(`${API_BASE}/rawg?page=1&pageSize=30`),
        ]);

        // Filtro giochi senza immagine
        setCarouselGames((carouselRes.data || []).filter((game) => game.background_image));
        setTopGames((topRes.data || []).filter((game) => game.background_image));
        setUpcomingGames((upcomingRes.data || []).filter((game) => game.background_image));
        setAllGames((allRes.data || []).filter((game) => game.background_image));
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading)
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );

  const getImage = (game) => game.background_image || "/img/default-game.jpg";

  const renderGameCard = (game, size = "medium") => (
    <div className={`game-card ${size}`} key={game.id}>
      <div className="game-image-wrapper">
        <img src={getImage(game)} alt={game.name} />
        <div className="card-overlay">
          <h4>{game.name}</h4>
          <div className="card-buttons">
            <button className="pill-button small">View Details</button>
            {size === "large" && <button className="pill-button small">Add to Cart</button>}
          </div>
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
            <SwiperSlide key={game.id}>{renderGameCard(game, "highlight")}</SwiperSlide>
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

      <section className="games-section all-games fade-in">
        <h3 className="section-title">All Games</h3>
        <div className="all-games-grid">{allGames.map((game) => renderGameCard(game, "large"))}</div>
      </section>
    </div>
  );
}

export default Home;
