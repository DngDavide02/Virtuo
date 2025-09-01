import React from "react";
import { Link } from "react-router-dom";
import "../css/help.css";

function Help() {
  return (
    <div className="page-container">
      <h1 className="page-title">Help & FAQ</h1>
      <p className="page-text">
        Need assistance? Check our FAQ below or visit our{" "}
        <Link to="/about" className="inline-link">
          About page
        </Link>{" "}
        to learn more about Virtuo.
      </p>

      <h2 className="page-subtitle">Frequently Asked Questions</h2>

      <div className="page-faq">
        <div className="faq-item">
          <p>
            <strong>Q:</strong> How do I navigate the platform?
          </p>
          <p>
            <strong>A:</strong> Use the top navigation to explore games, check upcoming releases, and access your profile. Go to the{" "}
            <Link to="/" className="inline-link">
              Home page
            </Link>{" "}
            to start browsing.
          </p>
        </div>

        <div className="faq-item">
          <p>
            <strong>Q:</strong> How can I stay updated on new releases?
          </p>
          <p>
            <strong>A:</strong> Follow our updates on the{" "}
            <Link to="/about" className="inline-link">
              About page
            </Link>{" "}
            or subscribe to our newsletter if available.
          </p>
        </div>

        <div className="faq-item">
          <p>
            <strong>Q:</strong> How do I contact support?
          </p>
          <p>
            <strong>A:</strong> Use the{" "}
            <Link to="/contact" className="inline-link">
              Contact page
            </Link>{" "}
            to reach out for help or report any issues.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Help;
