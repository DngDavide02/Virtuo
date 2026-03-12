import React from "react";
import { Link } from "react-router-dom";

const GameCard = ({ game, size = "large" }) => {
  const cardClass = `game-card ${size}`;
  
  return (
    <div className={cardClass}>
      <div className="game-image-wrapper">
        <img 
          src={game.thumbnail || "/img/default-game.jpg"} 
          alt={game.title || "Unknown"} 
          loading="lazy" 
        />
        {game.platforms && game.platforms.length > 0 && (
          <span className="card-badge">{game.platforms[0].name}</span>
        )}
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
        <div className="game-info">
          <span className="game-title">{game.title || "Unknown"}</span>
          <span className="game-date">{game.release_date || "TBA"}</span>
        </div>
        <div className="rating">{(game.rating || 0).toFixed(1)}</div>
      </div>
    </div>
  );
};

export default GameCard;
