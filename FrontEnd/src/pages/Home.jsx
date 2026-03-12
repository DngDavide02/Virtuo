import React from "react";
import { useGames } from "../hooks/useGames";

// Import components
import HeroSection from "../components/HeroSection";
import FeaturedGamesCarousel from "../components/FeaturedGamesCarousel";
import GameGrid from "../components/GameGrid";
import SpotlightSection from "../components/SpotlightSection";
import SearchAndSort from "../components/SearchAndSort";
import Pagination from "../components/Pagination";

// Import CSS
import "../css/home.css";
import "../css/swiper.css";

function Home() {
  const { carouselGames, topGames, spotlightGame, paginated, loading, hasMore, query, setQuery, sortBy, setSortBy, loadMore, resetPagination } = useGames();

  if (loading) {
    return (
      <div className="home-spinner">
        <div className="spinner-circle"></div>
        <span className="text-white">Loading games...</span>
      </div>
    );
  }

  return (
    <>
      <HeroSection />

      <div className="container">
        <FeaturedGamesCarousel games={carouselGames} />

        <section className="games-section top-rated fade-in">
          <h3 className="section-title">Top Rated</h3>
          <GameGrid games={topGames} />
        </section>

        <SpotlightSection spotlightGame={spotlightGame} />

        <section className="games-section all-games fade-in">
          <div className="section-header">
            <h3 className="section-title">Discover</h3>
            <SearchAndSort query={query} setQuery={setQuery} sortBy={sortBy} setSortBy={setSortBy} />
          </div>
          <GameGrid games={paginated} className="all-games-grid" />
          <Pagination hasMore={hasMore} onLoadMore={loadMore} onReset={resetPagination} />
        </section>
      </div>
    </>
  );
}

export default Home;
