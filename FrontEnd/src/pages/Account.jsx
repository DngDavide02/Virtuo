import React from "react";
import { Container, Button } from "react-bootstrap";
import { useAuth } from "../js/AuthContext";
import { Link } from "react-router-dom";

export default function Account() {
  const { user, logout } = useAuth();

  if (!user) return <p>Loading...</p>; // sicurezza

  return (
    <Container className="mt-5">
      <h2>Account</h2>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>

      {user.role === "ADMIN" && (
        <Link to="/admin">
          <Button variant="primary" className="mb-3">
            Go to Admin Dashboard
          </Button>
        </Link>
      )}

      <Button variant="danger" onClick={logout}>
        Logout
      </Button>
    </Container>
  );
}
