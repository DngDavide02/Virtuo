import React from "react";
import GameCard from "./GameCard";

const GameGrid = ({ games, className = "" }) => {
  return (
    <div className={`games-grid ${className}`}>
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};

export default GameGrid;
