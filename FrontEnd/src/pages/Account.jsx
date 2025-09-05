import React from "react";
import { Container, Button } from "react-bootstrap";
import { useAuth } from "../js/AuthContext";
import { Link } from "react-router-dom";
import "../css/account.css";

export default function Account() {
  const { user, logout } = useAuth();

  if (!user) return <p>Loading...</p>;

  return (
    <Container className="account-container">
      <h2>Account</h2>

      <div className="account-info">
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      <div className="account-buttons">
        {user.role === "ADMIN" && (
          <Link to="/admin">
            <Button variant="primary">Go to Admin Dashboard</Button>
          </Link>
        )}
        <Link to="/library">
          <Button variant="secondary">Go to My Library</Button>
        </Link>
        <Button className="btn-logout" onClick={logout}>
          Logout
        </Button>
      </div>
    </Container>
  );
}
