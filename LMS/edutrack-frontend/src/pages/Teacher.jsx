import { Link } from "react-router-dom";
import profesorImg from "../assets/profesor.png";

export default function Teacher() {
  return (
    <div className="container py-5">

      {/* CABECERA */}
      <section className="card shadow-sm border-0 mb-4 p-4">
        <div className="row align-items-center">

          {/* TEXTO */}
          <div className="col-md-7">

            <h1 className="fw-bold mb-3">
              Panel del <span className="text-success">Profesor</span>
            </h1>

            <p className="lead text-muted">
              Gestión académica y seguimiento de estudiantes.
            </p>

            <div className="mt-4 p-3 bg-light rounded shadow-sm">

              <h6 className="fw-bold mb-3">
                Funciones disponibles
              </h6>

              <ul className="mb-0">
                <li>Gestión de tareas académicas.</li>
                <li>Revisión de entregas.</li>
                <li>Seguimiento de alumnos.</li>
                <li>Calificación de actividades.</li>
                <li>Visualización de estadísticas.</li>
              </ul>

            </div>
          </div>

          {/* IMAGEN */}
          <div className="col-md-5 text-center">

            <img
              src={profesorImg}
              alt="Profesor"
              style={{
                maxWidth: "320px",
                borderRadius: "15px"
              }}
              className="img-fluid shadow-sm"
            />

          </div>

        </div>
      </section>

      {/* TARJETAS */}
      <div className="row g-3 mb-4">

        {/* TAREAS */}
        <div className="col-md-4">

          <div className="card shadow-sm border-0 p-3 h-100">

            <h5 className="fw-bold">📝 Tareas</h5>

            <p className="text-muted">
              Crear y administrar tareas académicas.
            </p>

            <Link
              to="/teacher/tasks"
              className="btn btn-primary"
            >
              Gestionar tareas
            </Link>

          </div>

        </div>

        {/* ENTREGAS */}
        <div className="col-md-4">

          <div className="card shadow-sm border-0 p-3 h-100">

            <h5 className="fw-bold">📤 Entregas</h5>

            <p className="text-muted">
              Revisar entregas de estudiantes.
            </p>

            <Link
              to="/teacher/submissions"
              className="btn btn-success"
            >
              Ver entregas
            </Link>

          </div>

        </div>

        {/* DASHBOARD */}
        <div className="col-md-4">

          <div className="card shadow-sm border-0 p-3 h-100">

            <h5 className="fw-bold">📊 Dashboard</h5>

            <p className="text-muted">
              Consultar estadísticas académicas.
            </p>

            <Link
              to="/teacher/dashboard"
              className="btn btn-dark"
            >
              Abrir dashboard
            </Link>

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="text-center text-muted mt-5">
        EduTrack © 2026 - Panel del Profesor
      </footer>

    </div>
  );
}