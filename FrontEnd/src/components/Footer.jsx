import React from "react";
import { Link } from "react-router-dom";
import "../css/footer.css";
import logo from "../assets/virtuo-logo.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={logo} alt="Virtuo" className="brand-logo-minimal" />
        </div>

        <div className="footer-links">
          <div className="footer-section">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <Link to="/help">Help Center</Link>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Virtuo. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
