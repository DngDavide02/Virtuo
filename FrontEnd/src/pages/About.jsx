import React from "react";
import "../css/about.css";

function About() {
  return (
    <div className="page-container about-page">
      <h1>About Virtuo</h1>
      <p>
        Virtuo is your ultimate platform to explore, discover, and manage video games. Whether you're a casual player or a hardcore gamer, our mission is to
        help you find your favorites, track upcoming releases, and stay connected with the gaming world.
      </p>

      <p>
        Our platform is powered by the{" "}
        <a href="https://rawg.io/apidocs" target="_blank" rel="noopener noreferrer">
          RAWG Video Games Database API
        </a>
        , giving you access to thousands of games with detailed information, release dates, ratings, screenshots, and more.
      </p>

      <p>
        Virtuo allows you to:
        <ul>
          <li>Browse detailed game pages and view key information like genre, platforms, and release date.</li>
          <li>Keep track of your favorite games and upcoming releases.</li>
          <li>Read community reviews and share your own gaming experiences.</li>
          <li>
            Access helpful resources like{" "}
            <a href="https://www.ign.com/" target="_blank" rel="noopener noreferrer">
              IGN
            </a>{" "}
            and{" "}
            <a href="https://www.metacritic.com/" target="_blank" rel="noopener noreferrer">
              Metacritic
            </a>{" "}
            for news and reviews.
          </li>
        </ul>
      </p>

      <p>
        Join our community and level up your gaming experience! Whether you’re here to discover new titles, track your collections, or simply explore, Virtuo is
        the hub for gamers who want to stay ahead of the curve.
      </p>

      <p>
        Want to get in touch? Visit our <a href="/contact">Contact page</a> or follow us on{" "}
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          Twitter
        </a>{" "}
        and{" "}
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
        .
      </p>
    </div>
  );
}

export default About;
