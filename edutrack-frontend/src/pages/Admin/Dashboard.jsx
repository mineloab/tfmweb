import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    groups: 0,
    subjects: 0,
    students: 0,
    tasks: 0,
    submissions: 0,
    grades: 0,
    avg_grade: 0,
    late_count: 0,
    on_time_count: 0,
    students_grades: [],
    subjects_grades: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/dashboard/stats");

        setStats({
          groups: res.data?.data?.groups ?? 0,
          subjects: res.data?.data?.subjects ?? 0,
          students: res.data?.data?.students ?? 0,
          tasks: res.data?.data?.tasks ?? 0,
          submissions: res.data?.data?.submissions ?? 0,
          grades: res.data?.data?.grades ?? 0,
          avg_grade: res.data?.data?.avg_grade ?? 0,
          late_count: res.data?.data?.late_count ?? 0,
          on_time_count: res.data?.data?.on_time_count ?? 0,
          students_grades: res.data?.data?.students_grades ?? [],
          subjects_grades: res.data?.data?.subjects_grades ?? [],
        });
      } catch (e) {
        const msg =
          e?.response?.data?.error ||
          e?.response?.data?.message ||
          e?.message ||
          "Error cargando estadísticas";

        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const totalsBarData = {
    labels: ["Grupos", "Asignaturas", "Alumnos", "Tareas", "Entregas", "Notas"],
    datasets: [
      {
        label: "Totales",
        data: [
          stats.groups,
          stats.subjects,
          stats.students,
          stats.tasks,
          stats.submissions,
          stats.grades,
        ],
        backgroundColor: [
          "rgba(13, 110, 253, 0.7)",
          "rgba(25, 135, 84, 0.7)",
          "rgba(255, 193, 7, 0.7)",
          "rgba(220, 53, 69, 0.7)",
          "rgba(13, 202, 240, 0.7)",
          "rgba(108, 117, 125, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const tasksVsSubmissionsData = {
    labels: ["Tareas", "Entregas"],
    datasets: [
      {
        label: "Relación tareas/entregas",
        data: [stats.tasks, stats.submissions],
        backgroundColor: [
          "rgba(220, 53, 69, 0.8)",
          "rgba(13, 202, 240, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const deliveryStatusData = {
    labels: ["A tiempo", "Fuera de plazo"],
    datasets: [
      {
        label: "Estado de entregas",
        data: [stats.on_time_count, stats.late_count],
        backgroundColor: [
          "rgba(25, 135, 84, 0.8)",
          "rgba(220, 53, 69, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const studentsChartData = {
    labels: stats.students_grades.map((s) => s.name),
    datasets: [
      {
        label: "Media por alumno",
        data: stats.students_grades.map((s) => Number(s.avg_score)),
        backgroundColor: "rgba(13, 110, 253, 0.7)",
        borderColor: "rgba(13, 110, 253, 1)",
        borderWidth: 1,
      },
    ],
  };

  const subjectsChartData = {
    labels: stats.subjects_grades.map((s) => s.name),
    datasets: [
      {
        label: "Media por asignatura",
        data: stats.subjects_grades.map((s) => Number(s.avg_score)),
        backgroundColor: "rgba(255, 193, 7, 0.7)",
        borderColor: "rgba(255, 193, 7, 1)",
        borderWidth: 1,
      },
    ],
  };

  const avgLineData = {
    labels: ["Media general"],
    datasets: [
      {
        label: "Nota media",
        data: [stats.avg_grade],
        borderColor: "rgba(25, 135, 84, 1)",
        backgroundColor: "rgba(25, 135, 84, 0.3)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard Admin / Profesor</h2>

      {loading && <div className="alert alert-info">Cargando estadísticas...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          <div className="row g-3">
            <div className="col-md-4 col-lg-3">
              <div className="card text-center shadow-sm border-primary h-100">
                <div className="card-body">
                  <h5 className="card-title">Grupos</h5>
                  <h2 className="mb-0">{stats.groups}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center shadow-sm border-success h-100">
                <div className="card-body">
                  <h5 className="card-title">Asignaturas</h5>
                  <h2 className="mb-0">{stats.subjects}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center shadow-sm border-warning h-100">
                <div className="card-body">
                  <h5 className="card-title">Alumnos</h5>
                  <h2 className="mb-0">{stats.students}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center shadow-sm border-danger h-100">
                <div className="card-body">
                  <h5 className="card-title">Tareas</h5>
                  <h2 className="mb-0">{stats.tasks}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center shadow-sm border-info h-100">
                <div className="card-body">
                  <h5 className="card-title">Entregas</h5>
                  <h2 className="mb-0">{stats.submissions}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center shadow-sm border-secondary h-100">
                <div className="card-body">
                  <h5 className="card-title">Notas</h5>
                  <h2 className="mb-0">{stats.grades}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center shadow-sm border-dark h-100">
                <div className="card-body">
                  <h5 className="card-title">Media de notas</h5>
                  <h2 className="mb-0">{stats.avg_grade}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Media de notas</h5>
              <div className="progress" style={{ height: "28px" }}>
                <div
                  className="progress-bar bg-success fw-bold"
                  role="progressbar"
                  style={{ width: `${Math.max(0, Math.min(100, stats.avg_grade * 10))}%` }}
                  aria-valuenow={stats.avg_grade * 10}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {stats.avg_grade}
                </div>
              </div>
              <small className="text-muted d-block mt-2">
                Escala visual sobre 10 puntos.
              </small>
            </div>
          </div>

          <div className="row mt-4 g-4">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Resumen general</h5>
                  <Bar data={totalsBarData} options={commonOptions} />
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Tareas vs Entregas</h5>
                  <Doughnut data={tasksVsSubmissionsData} options={commonOptions} />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Entregas a tiempo / fuera de plazo</h5>
                  <Doughnut data={deliveryStatusData} options={commonOptions} />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Media general</h5>
                  <Line data={avgLineData} options={commonOptions} />
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Media de notas por alumno</h5>
                  <Bar data={studentsChartData} options={commonOptions} />
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Media de notas por asignatura</h5>
                  <Bar data={subjectsChartData} options={commonOptions} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}