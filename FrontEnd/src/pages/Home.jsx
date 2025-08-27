import React, { useEffect, useState } from "react";
import axios from "axios";

import "./Pages.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper"; // correttamente importati

function Home() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/games/rawg?page=1&pageSize=12")
      .then((res) => {
        const shuffled = res.data.sort(() => 0.5 - Math.random());
        setGames(shuffled.slice(0, 20));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {/* HERO BANNER */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h2>Elden Ring Nightreign</h2>
          <p>Discover the dark and fascinating world created by FromSoftware in this multiplayer adventure where you can play with up to 3 players.</p>
          <div className="hero-buttons">
            <button className="pill-button">Shop Now</button>
            <button className="pill-button">Discover</button>
          </div>
        </div>
      </div>

      {/* CARD CONTAINER */}
      <div className="games-section">
        <div className="games-card">
          <h3>Discover more games</h3>
          <Swiper
            modules={[Navigation, Pagination]} // qui specifichi i moduli
            spaceBetween={20}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
          >
            {games.map((game) => (
              <SwiperSlide key={game.id}>
                <div className="game-card">
                  <img src={game.background_image} alt={game.name} />
                  <h4>{game.name}</h4>
                  <div className="game-card-buttons">
                    <button className="pill-button small">View Game</button>
                    <button className="pill-button small">Add to Cart</button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default Home;
