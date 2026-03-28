import { useEffect, useState } from "react";
import { api } from "../../api/axios";

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);

  const [taskId, setTaskId] = useState("");
  const [userId, setUserId] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    setOk("");

    try {
      const [sRes, tRes, uRes] = await Promise.all([
        api.get("/submissions"),
        api.get("/tasks"),
        api.get("/users"),
      ]);

      setSubmissions(Array.isArray(sRes.data?.data) ? sRes.data.data : []);
      setTasks(Array.isArray(tRes.data?.data) ? tRes.data.data : []);
      setStudents(Array.isArray(uRes.data?.data) ? uRes.data.data : []);
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "Error cargando datos";

      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleUpload(e) {
    e.preventDefault();
    setError("");
    setOk("");

    if (!taskId || !userId || !file) {
      setError("Selecciona tarea, alumno y archivo.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("task_id", taskId);
      formData.append("user_id", userId);
      formData.append("file", file);

      await api.post("/submissions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTaskId("");
      setUserId("");
      setFile(null);

      setOk("Entrega subida correctamente.");
      await loadData();
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "No se pudo subir la entrega.";
      setError(msg);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta entrega?")) return;

    setError("");
    setOk("");

    try {
      await api.delete(`/submissions/${id}`);
      setOk("Entrega eliminada.");
      await loadData();
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "No se pudo eliminar.";
      setError(msg);
    }
  }

  const uploadBaseUrl = "http://localhost/edutrack-api/uploads/";

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Entregas (Submissions)</h2>

      {loading && <div className="alert alert-info">Cargando…</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {ok && <div className="alert alert-success">{ok}</div>}

      {/* FORMULARIO */}
      <div className="card p-3 mb-4">
        <h5 className="mb-3">Subir entrega</h5>

        <form onSubmit={handleUpload} className="row g-2">
          <div className="col-md-4">
            <select
              className="form-select"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              required
            >
              <option value="">Seleccionar tarea</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  #{t.id} - {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            >
              <option value="">Seleccionar alumno</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
            />
          </div>

          <div className="col-12">
            <button className="btn btn-primary mt-2">Subir entrega</button>
          </div>
        </form>
      </div>

      {/* TABLA */}
      <div className="card p-3">
        <h5 className="mb-3">Listado de entregas</h5>

        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tarea</th>
                <th>Alumno</th>
                <th>Archivo</th>
                <th>Fecha</th>
                <th style={{ width: 120 }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.task}</td>
                  <td>{s.student}</td>
                  <td>
                    {s.file_path ? (
                      <a href={`${uploadBaseUrl}${s.file_path}`} target="_blank" rel="noreferrer">
                        Descargar
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{s.submitted_at ?? "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(s.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {submissions.length === 0 && !loading && (
                <tr>
                  <td colSpan="6">No hay entregas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}