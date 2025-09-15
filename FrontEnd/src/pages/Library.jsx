import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../js/AuthContext";
import { Spinner, Card, Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3001/api/library";

export default function Library() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.username) {
      console.log("[DEBUG] No user logged in yet");
      return;
    }

    const fetchLibrary = async () => {
      try {
        console.log("[DEBUG] Fetching library for user:", user.username);
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(API_BASE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("[DEBUG] Library fetched:", res.data);
        setGames(res.data);
      } catch (err) {
        console.error("[DEBUG] Error fetching library:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [user]);

  const handleGameDetail = (gameId) => {
    console.log("[DEBUG] Navigating to game details for id:", gameId);
    navigate(`/games/${gameId}`);
  };

  const handleDelete = async (gameId) => {
    console.log("[DEBUG] Attempting to remove game with id:", gameId);
    if (!window.confirm("Are you sure you want to remove this game from your library?")) {
      console.log("[DEBUG] User cancelled removal");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_BASE}/remove/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("[DEBUG] Remove response:", response.data);

      setGames((prevGames) => {
        const updated = prevGames.filter((game) => game.id !== gameId);
        console.log("[DEBUG] Updated games list after removal:", updated);
        return updated;
      });
    } catch (err) {
      console.error("[DEBUG] Error deleting game:", err);
      alert("Failed to remove the game. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Library</h2>
      <Row>
        {games.length === 0 ? (
          <p>You have no games in your library.</p>
        ) : (
          games.map((game) => (
            <Col key={game.id} xs={12} md={6} lg={4} className="mb-3">
              <Card>
                <Card.Img variant="top" src={game.thumbnail} />
                <Card.Body>
                  <Card.Title>{game.title}</Card.Title>
                  <Card.Text>Released: {game.release_date}</Card.Text>
                  <Card.Text>{game.shortDescription}</Card.Text>
                  <Button variant="primary" className="me-2" onClick={() => handleGameDetail(game.id)}>
                    View Details
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(game.id)}>
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
