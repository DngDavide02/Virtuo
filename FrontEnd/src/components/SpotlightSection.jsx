import React from "react";
import { Link } from "react-router-dom";

const SpotlightSection = ({ spotlightGame }) => {
  if (!spotlightGame) return null;

  return (
    <section 
      className="spotlight-section" 
      style={{ backgroundImage: `url(${spotlightGame.background_image || spotlightGame.thumbnail})` }}
    >
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
  );
};

export default SpotlightSection;
