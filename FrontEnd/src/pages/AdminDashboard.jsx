import React from "react";
import { Container, Card } from "react-bootstrap";

export default function AdminDashboard() {
  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <h2>Admin Dashboard</h2>
        <p>Benvenuto, qui solo gli amministratori possono accedere.</p>
      </Card>
    </Container>
  );
}
