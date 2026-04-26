import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 16 }}>Cargando…</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "teacher") return <Navigate to="/teacher" replace />;
  if (user.role === "student") return <Navigate to="/student" replace />;

  return (
    <div style={{ padding: 16 }}>
      <h2>Home</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <div>Rol no reconocido: {user.role}</div>
    </div>
  );
}