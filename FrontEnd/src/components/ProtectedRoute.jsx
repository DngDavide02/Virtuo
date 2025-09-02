import { Navigate } from "react-router-dom";
import { useAuth } from "../js/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role.toUpperCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
