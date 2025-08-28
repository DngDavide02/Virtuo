import React, { useEffect, useState } from "react";
import axios from "axios";

import "../css/home.css";
import "../css/swiper.css";
import "../css/games.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper";

function Home() {
  const [carouselGames, setCarouselGames] = useState([]);
  const [allGames, setAllGames] = useState([]);

  useEffect(() => {
    // CAROUSEL: 12 giochi random
    axios
      .get("http://localhost:3001/api/games/rawg?page=1&pageSize=12")
      .then((res) => {
        const shuffled = res.data.sort(() => 0.5 - Math.random());
        setCarouselGames(shuffled);
      })
      .catch((err) => console.error(err));

    // GRID: 30 giochi divisi in due richieste da 15
    const fetchAllGames = async () => {
      try {
        const res1 = await axios.get("http://localhost:3001/api/games/rawg?page=1&pageSize=15");
        const res2 = await axios.get("http://localhost:3001/api/games/rawg?page=2&pageSize=15");
        const combined = [...res1.data, ...res2.data];
        setAllGames(combined);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllGames();
  }, []);

  return (
    <div className="container">
      {/* HERO BANNER */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h2>Elden Ring Nightreign</h2>
          <p>Discover the dark and fascinating world created by FromSoftware in this multiplayer adventure where you can play with up to 3 players.</p>
          <div className="hero-buttons">
            <button className="pill-button">Shop Now</button>
            <button className="pill-button">Discover</button>
          </div>
        </div>
      </section>

      {/* GAMES CAROUSEL */}
      <section className="games-section">
        <div className="games-card">
          <h3>Discover More Games</h3>
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
      </section>

      {/* ALL GAMES GRID */}
      <section className="games-section">
        <h3>All Games</h3>
        <div className="all-games-grid">
          {allGames.map((game) => (
            <div className="game-card" key={game.id}>
              <img src={game.background_image} alt={game.name} />
              <h4>{game.name}</h4>
              <div className="game-card-buttons">
                <button className="pill-button small">View Game</button>
                <button className="pill-button small">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
