import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import GameCard from "./GameCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeaturedGamesCarousel = ({ games }) => {
  return (
    <section className="games-section fade-in">
      <h3 className="section-title">Featured Games</h3>
      <div className="row justify-content-center">
        <div className="col-lg-10">
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
            {games.map((game) => (
              <SwiperSlide key={game.id}>
                <GameCard game={game} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGamesCarousel;
