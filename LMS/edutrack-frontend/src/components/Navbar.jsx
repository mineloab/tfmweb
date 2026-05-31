import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  if (!user) return null;

  return (
    <nav className="navbar navbar-dark bg-dark px-3 d-flex justify-content-between">
      <div className="d-flex align-items-center gap-3">
        <Link className="navbar-brand fw-bold mb-0" to="/">
          EduTrack
        </Link>

        {user.role === "admin" && (
          <>
            <Link className="nav-link text-light" to="/admin/dashboard">
              Dashboard
            </Link>
            <Link className="nav-link text-light" to="/admin/groups">
              Grupos
            </Link>
            <Link className="nav-link text-light" to="/admin/subjects">
              Asignaturas
            </Link>
            <Link className="nav-link text-light" to="/admin/group-subjects">
              Grupo-Asignaturas
            </Link>
            <Link className="nav-link text-light" to="/admin/enrollments">
              Matrículas
            </Link>
            <Link className="nav-link text-light" to="/admin/tasks">
              Tareas
            </Link>
            <Link className="nav-link text-light" to="/admin/submissions">
              Entregas
            </Link>
          </>
        )}

        {user.role === "teacher" && (
          <>
            <Link className="nav-link text-light" to="/teacher">
              Dashboard
            </Link>
            <Link className="nav-link text-light" to="/teacher/tasks">
              Tareas
            </Link>
            <Link className="nav-link text-light" to="/teacher/submissions">
              Entregas
            </Link>
          </>
        )}

        {user.role === "student" && (
          <Link className="nav-link text-light" to="/student">
            Panel Alumno
          </Link>
        )}
      </div>

      <div className="d-flex align-items-center gap-3">
        <span className="text-white">
          {user.name} ({user.role})
        </span>

        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}