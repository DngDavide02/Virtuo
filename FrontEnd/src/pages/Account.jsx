import React, { useEffect, useState } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import { useAuth } from "../js/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../css/account.css";

const API_BASE = "http://localhost:3001/api/library";

export default function Account() {
  const { user, logout } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.username) return;

    const fetchLibrary = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(API_BASE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGames(res.data);
      } catch (err) {
        console.error("Error fetching library:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [user]);

  const goToDetails = (id) => navigate(`/games/${id}`);

  const removeGame = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGames((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

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
        <Button className="btn-logout" onClick={logout}>
          Logout
        </Button>
      </div>

      <h2 className="library-title" style={{ marginTop: "2rem" }}>
        My Library
      </h2>

      {loading ? (
        <div className="library-page-spinner">
          <Spinner animation="border" />
        </div>
      ) : games.length === 0 ? (
        <p className="library-empty">No games in your library.</p>
      ) : (
        <div className="library-grid">
          {games.map((game) => (
            <div key={game.id} className="library-card">
              <div className="library-card-img">
                <img src={game.thumbnail} alt={game.title} />
              </div>
              <div className="library-card-meta">
                <h3 className="library-card-title">{game.title}</h3>
                <div className="library-card-buttons">
                  <button onClick={() => goToDetails(game.id)} className="btn-primary">
                    View
                  </button>
                  <button onClick={() => removeGame(game.id)} className="btn-secondary">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
