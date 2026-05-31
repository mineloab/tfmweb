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

import { Bar, Doughnut } from "react-chartjs-2";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
        groups: data.groups ?? 0,
        subjects: data.subjects ?? 0,
        students: data.students ?? 0,
        tasks: data.tasks ?? 0,
        submissions: data.submissions ?? 0,
        grades: data.grades ?? 0,
        avg_grade: data.avg_grade ?? 0,
        late_count: data.late_count ?? 0,
        on_time_count: data.on_time_count ?? 0,
      });
    } catch (e) {
      console.error(e);
      setError("Error cargando estadísticas");
    } finally {
      setLoading(false);
    }
  }

  async function exportPDF() {
    const input = document.getElementById("dashboard-pdf");

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 20;

    pdf.setFontSize(18);
    pdf.text("Dashboard académico - EduTrack", 10, 10);

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);

    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      pdf.addPage();

      position = heightLeft - imgHeight + 20;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);

      heightLeft -= pageHeight;
    }

    pdf.save("dashboard_edutrack.pdf");
  }

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const totalsBarData = {
    labels: [
      "Grupos",
      "Asignaturas",
      "Alumnos",
      "Tareas",
      "Entregas",
      "Notas",
    ],

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
          "rgba(13,110,253,0.7)",
          "rgba(25,135,84,0.7)",
          "rgba(255,193,7,0.7)",
          "rgba(220,53,69,0.7)",
          "rgba(13,202,240,0.7)",
          "rgba(108,117,125,0.7)",
        ],
      },
    ],
  };

  const tasksVsSubmissionsData = {
    labels: ["Tareas", "Entregas"],

    datasets: [
      {
        data: [stats.tasks, stats.submissions],

        backgroundColor: [
          "rgba(220,53,69,0.8)",
          "rgba(13,202,240,0.8)",
        ],
      },
    ],
  };

  const deliveryStatusData = {
    labels: ["A tiempo", "Fuera de plazo"],

    datasets: [
      {
        data: [stats.on_time_count, stats.late_count],

        backgroundColor: [
          "rgba(25,135,84,0.8)",
          "rgba(220,53,69,0.8)",
        ],
      },
    ],
  };

  return (
    <div className="container mt-4" id="dashboard-pdf">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard Admin / Profesor</h2>

        <button className="btn btn-danger" onClick={exportPDF}>
          Exportar PDF
        </button>
      </div>

      {loading && (
        <div className="alert alert-info">
          Cargando estadísticas...
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="row g-3">

            <div className="col-md-4 col-lg-3">
              <div className="card text-center border-primary">
                <div className="card-body">
                  <h5>Grupos</h5>
                  <h2>{stats.groups}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center border-success">
                <div className="card-body">
                  <h5>Asignaturas</h5>
                  <h2>{stats.subjects}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center border-warning">
                <div className="card-body">
                  <h5>Alumnos</h5>
                  <h2>{stats.students}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center border-danger">
                <div className="card-body">
                  <h5>Tareas</h5>
                  <h2>{stats.tasks}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center border-info">
                <div className="card-body">
                  <h5>Entregas</h5>
                  <h2>{stats.submissions}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center border-secondary">
                <div className="card-body">
                  <h5>Notas</h5>
                  <h2>{stats.grades}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="card text-center border-dark">
                <div className="card-body">
                  <h5>Media de notas</h5>
                  <h2>{stats.avg_grade}</h2>
                </div>
              </div>
            </div>

          </div>

          <div className="row mt-4 g-4">

            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <h5>Resumen general</h5>

                  <Bar
                    data={totalsBarData}
                    options={commonOptions}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5>Tareas vs Entregas</h5>

                  <Doughnut
                    data={tasksVsSubmissionsData}
                    options={commonOptions}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5>Entregas a tiempo / fuera de plazo</h5>

                  <Doughnut
                    data={deliveryStatusData}
                    options={commonOptions}
                  />
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}