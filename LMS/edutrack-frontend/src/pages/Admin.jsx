import { Link } from "react-router-dom";

export default function Admin() {
  return (
    <div className="container py-4">
      <section className="card shadow-sm border-0 mb-4 p-4">
        <div className="row align-items-center">
          <div className="col-md-7">
            <h1 className="fw-bold mb-3">
              ¡Bienvenido a <span className="text-primary">EduTrack</span>!
            </h1>

            <p className="lead text-muted">
              Sistema de gestión académica y seguimiento educativo.
            </p>

            <p className="text-muted">
              Administra grupos, asignaturas, matrículas, tareas y entregas de forma sencilla.
            </p>

            <div className="mt-4 p-3 bg-light rounded shadow-sm">
              <h6 className="fw-bold mb-2">Funciones principales del sistema</h6>
              <ul className="mb-0">
                <li>Gestión de grupos y asignaturas.</li>
                <li>Administración de matrículas de alumnos.</li>
                <li>Creación y seguimiento de tareas.</li>
                <li>Gestión de entregas académicas.</li>
                <li>Visualización de estadísticas educativas.</li>
              </ul>
            </div>
          </div>

          <div className="col-md-5 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
              alt="Educación digital"
              style={{ maxWidth: "230px" }}
              className="img-fluid"
            />
          </div>
        </div>
      </section>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 h-100">
            <h5 className="fw-bold">Grupos</h5>
            <p className="text-muted">Gestiona los grupos de estudiantes.</p>
            <Link to="/admin/groups" className="btn btn-outline-primary btn-sm">
              Ver grupos
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 h-100">
            <h5 className="fw-bold">Asignaturas</h5>
            <p className="text-muted">Administra las asignaturas disponibles.</p>
            <Link to="/admin/subjects" className="btn btn-outline-success btn-sm">
              Ver asignaturas
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 h-100">
            <h5 className="fw-bold">Tareas</h5>
            <p className="text-muted">Crea y gestiona tareas académicas.</p>
            <Link to="/admin/tasks" className="btn btn-outline-danger btn-sm">
              Ver tareas
            </Link>
          </div>
        </div>
      </div>

      <section className="card shadow-sm border-0 p-4">
        <h4 className="mb-3">Accesos rápidos</h4>

        <div className="row g-3">
          <div className="col-md-2">
            <Link to="/admin/dashboard" className="btn btn-light w-100">
              Dashboard
            </Link>
          </div>

          <div className="col-md-2">
            <Link to="/admin/group-subjects" className="btn btn-light w-100">
              Grupo-Asignaturas
            </Link>
          </div>

          <div className="col-md-2">
            <Link to="/admin/enrollments" className="btn btn-light w-100">
              Matrículas
            </Link>
          </div>

          <div className="col-md-2">
            <Link to="/admin/submissions" className="btn btn-light w-100">
              Entregas
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-center text-muted mt-5">
        EduTrack © 2026 - Sistema de gestión académica | TFM - UOC
      </footer>
    </div>
  );
}