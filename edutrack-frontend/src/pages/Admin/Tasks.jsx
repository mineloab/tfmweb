import { useEffect, useState } from "react";
import { api } from "../../api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [groups, setGroups] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function loadData() {
    setError("");
    setOk("");

    try {
      const [t, s, g] = await Promise.all([
        api.get("/tasks"),
        api.get("/subjects"),
        api.get("/groups"),
      ]);

      setTasks(Array.isArray(t.data?.data) ? t.data.data : []);
      setSubjects(Array.isArray(s.data?.data) ? s.data.data : []);
      setGroups(Array.isArray(g.data?.data) ? g.data.data : []);
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "Error cargando datos";
      setError(msg);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setOk("");

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        subject_id: Number(subjectId),
        group_id: Number(groupId),
        due_date: dueDate ? dueDate.replace("T", " ") + ":00" : null,
      };

      const res = await api.post("/tasks", payload);

      const created = res.data?.data;
      if (created && created.id) {
        setTasks((prev) => [created, ...prev]);
      } else {
        await loadData();
      }

      setTitle("");
      setDescription("");
      setSubjectId("");
      setGroupId("");
      setDueDate("");

      setOk("Tarea creada correctamente.");
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "No se pudo crear la tarea";
      setError(msg);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar esta tarea?")) return;

    setError("");
    setOk("");

    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setOk("Tarea eliminada.");
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "No se pudo eliminar";
      setError(msg);
    }
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestión de tareas</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {ok && <div className="alert alert-success">{ok}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Crear nueva tarea</h5>

          <form onSubmit={handleCreate} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Título</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la tarea"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Fecha límite</label>
              <input
                type="datetime-local"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Grupo</label>
              <select
                className="form-select"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                required
              >
                <option value="">Seleccionar grupo</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Asignatura</label>
              <select
                className="form-select"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                required
              >
                <option value="">Seleccionar asignatura</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción"
              />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Crear tarea
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Listado de tareas</h5>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Grupo</th>
                  <th>Asignatura</th>
                  <th>Fecha límite</th>
                  <th style={{ width: "140px" }}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.title}</td>
                    <td>{t.group_name ?? "-"}</td>
                    <td>{t.subject ?? "-"}</td>
                    <td>{t.due_date ?? "-"}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(t.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}

                {tasks.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No hay tareas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}