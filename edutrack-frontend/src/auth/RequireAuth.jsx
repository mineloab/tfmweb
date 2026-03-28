import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 16 }}>Cargando…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}