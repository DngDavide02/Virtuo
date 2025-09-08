import React from "react";
import "../css/about.css";

function About() {
  return (
    <div className="page-container about-page">
      <h1>About Virtuo</h1>
      <p>
        Virtuo is your platform to discover, explore, and manage your favorite video games. Whether you're a casual player or a passionate gamer, our goal is to
        help you find new titles and organize your personal collection.
      </p>

      <p>
        Our site uses the{" "}
        <a href="https://www.freetogame.com/api-doc" target="_blank" rel="noopener noreferrer">
          Free To Game API
        </a>{" "}
        to give you access to a wide range of free games, with detailed information on genres, platforms, release dates, and more.
      </p>

      <p>
        With Virtuo, you can:
        <ul>
          <li>Explore games and view all the main information about each title.</li>
          <li>Add games to your personal library to keep track of your favorites.</li>
          <li>Chat and discuss games with other users in the community.</li>
        </ul>
      </p>

      <p>
        Join our community and level up your gaming experience! Whether you want to discover new titles, manage your collection, or just talk about games with
        fellow gamers, Virtuo is the right place for you.
      </p>

      <p>
        Want to get in touch or follow us? Visit our <a href="/contact">Contact page</a>.
      </p>
    </div>
  );
}

export default About;
