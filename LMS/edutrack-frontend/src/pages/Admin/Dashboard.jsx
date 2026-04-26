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
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/dashboard/stats");
      const data = res.data?.data || res.data || {};

      setStats({
        groups: data.groups ?? data.grupos ?? 0,
        subjects: data.subjects ?? data.asignaturas ?? 0,
        students: data.students ?? data.alumnos ?? 0,
        tasks: data.tasks ?? data.tareas ?? 0,
        submissions: data.submissions ?? data.entregas ?? 0,
        grades: data.grades ?? data.notas ?? 0,
        avg_grade: data.avg_grade ?? data.avg ?? data.average ?? data.media ?? data.media_notas ?? 0,
        late_count: data.late_count ?? 0,
        on_time_count: data.on_time_count ?? 0,
        students_grades: data.students_grades ?? [],
        subjects_grades: data.subjects_grades ?? [],
      });
    } catch (e) {
      setError(
        e?.response?.data?.error ||
          e?.response?.data?.message ||
          e?.message ||
          "Error cargando estadísticas"
      );
    } finally {
      setLoading(false);
    }
  }

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
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
        backgroundColor: ["rgba(220, 53, 69, 0.8)", "rgba(13, 202, 240, 0.8)"],
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
        backgroundColor: ["rgba(25, 135, 84, 0.8)", "rgba(220, 53, 69, 0.8)"],
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
        data: [Number(stats.avg_grade)],
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
                  <h5>Grupos</h5>
                  <h2>{stats.groups}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center shadow-sm border-success h-100">
                <div className="card-body">
                  <h5>Asignaturas</h5>
                  <h2>{stats.subjects}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center shadow-sm border-warning h-100">
                <div className="card-body">
                  <h5>Alumnos</h5>
                  <h2>{stats.students}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center shadow-sm border-danger h-100">
                <div className="card-body">
                  <h5>Tareas</h5>
                  <h2>{stats.tasks}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center shadow-sm border-info h-100">
                <div className="card-body">
                  <h5>Entregas</h5>
                  <h2>{stats.submissions}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center shadow-sm border-secondary h-100">
                <div className="card-body">
                  <h5>Notas</h5>
                  <h2>{stats.grades}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center shadow-sm border-dark h-100">
                <div className="card-body">
                  <h5>Media de notas</h5>
                  <h2>{stats.avg_grade}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h5 className="mb-3">Media de notas</h5>
              <div className="progress" style={{ height: "28px" }}>
                <div
                  className="progress-bar bg-success fw-bold"
                  style={{ width: `${Math.max(0, Math.min(100, Number(stats.avg_grade) * 10))}%` }}
                >
                  {stats.avg_grade}
                </div>
              </div>
              <small className="text-muted d-block mt-2">Escala visual sobre 10 puntos.</small>
            </div>
          </div>

          <div className="row mt-4 g-4">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Resumen general</h5>
                  <Bar data={totalsBarData} options={commonOptions} />
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Tareas vs Entregas</h5>
                  <Doughnut data={tasksVsSubmissionsData} options={commonOptions} />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Entregas a tiempo / fuera de plazo</h5>
                  <Doughnut data={deliveryStatusData} options={commonOptions} />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Media general</h5>
                  <Bar data={avgLineData} options={commonOptions} />
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Media de notas por alumno</h5>
                  <Bar data={studentsChartData} options={commonOptions} />
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Media de notas por asignatura</h5>
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