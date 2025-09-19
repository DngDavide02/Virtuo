import React, { useEffect, useState } from "react";
import { Container, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import "../css/adminPage.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const API_URL = "http://localhost:3001/api/admin/users";
  const token = localStorage.getItem("token");

  /* Recupera lista utenti dall'API */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(res.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  /* Aggiorna il ruolo di un utente */
  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      await axios.put(`${API_URL}/${userId}`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      console.error("Error updating role:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  /* Elimina un utente */
  const handleDelete = async (userId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo utente?")) return;
    try {
      await axios.delete(`${API_URL}/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (loading) return <Spinner animation="border" className="mt-5" />;

  return (
    <Container className="mt-5 admin-page">
      <h2>Gestione Utenti</h2>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <Form.Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={updatingId === user.id}
                    className="admin-select"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </Form.Select>
                </td>
                <td>
                  <Button className="admin-delete-btn" size="sm" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
