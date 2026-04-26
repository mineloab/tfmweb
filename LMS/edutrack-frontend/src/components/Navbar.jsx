import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/admin/dashboard">
          EduTrack
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard">
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/groups">
                Grupos
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/subjects">
                Asignaturas
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/group-subjects">
                Grupo-Asignaturas
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/enrollments">
                Matrículas
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/tasks">
                Tareas
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/submissions">
                Entregas
              </Link>
            </li>

          </ul>

          <button className="btn btn-outline-light" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}