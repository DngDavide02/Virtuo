import React from "react";
import { Link } from "react-router-dom";
import heroBackground from "../assets/hero.jpg";

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection;
