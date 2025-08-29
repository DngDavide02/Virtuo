import React from "react";

function Help() {
  return (
    <div className="page-container">
      <h1 className="page-title">Help & FAQ</h1>
      <p className="page-text">Need assistance? Check out our FAQ or contact support for help with your account or purchases.</p>

      <h2 className="page-subtitle">Frequently Asked Questions</h2>

      <div className="page-faq">
        <p>
          <strong>Q:</strong> How do I create an account?
        </p>
        <p>
          <strong>A:</strong> Click on the register button on the top right and fill in your details to create a new account.
        </p>

        <p>
          <strong>Q:</strong> How do I purchase a game?
        </p>
        <p>
          <strong>A:</strong> Select the game from the catalog, add it to your cart, and complete the checkout process.
        </p>

        <p>
          <strong>Q:</strong> How can I contact support?
        </p>
        <p>
          <strong>A:</strong> Use the Contact page or reach out directly via email for assistance.
        </p>
      </div>
    </div>
  );
}

export default Help;
