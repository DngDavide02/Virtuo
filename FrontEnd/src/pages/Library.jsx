import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../js/AuthContext";
import { Spinner, Card, Container, Row, Col } from "react-bootstrap";

const API_BASE = "http://localhost:3001/api/library";

export default function Library() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

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
                <Card.Img variant="top" src={game.background_image} />
                <Card.Body>
                  <Card.Title>{game.name}</Card.Title>
                  <Card.Text>Released: {game.released}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
