import React from "react";
import "./Pages.css";

function Games() {
  return (
    <div className="page-container">
      <h1>Games</h1>
      <p>Browse and explore all the amazing video games we offer. You can filter, search, and add your favorites to your collection.</p>
      {/* Qui in futuro puoi integrare la lista di giochi con fetch dall’API RAWG */}
    </div>
  );
}

export default Games;
