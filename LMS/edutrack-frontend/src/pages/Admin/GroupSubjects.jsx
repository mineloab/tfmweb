import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function GroupSubjects() {
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [relations, setRelations] = useState([]);

  const [groupId, setGroupId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      setError("");

      const [groupsRes, subjectsRes, relationsRes] = await Promise.all([
        api.get("/groups"),
        api.get("/subjects"),
        api.get("/group-subjects"),
      ]);

      setGroups(groupsRes.data.data || []);
      setSubjects(subjectsRes.data.data || []);
      setRelations(relationsRes.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los datos");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!groupId || !subjectId) {
      setError("Debes seleccionar un grupo y una asignatura");
      return;
    }

    try {
      setError("");
      setOk("");

      await api.post("/group-subjects", {
        group_id: Number(groupId),
        subject_id: Number(subjectId),
      });

      setGroupId("");
      setSubjectId("");

      setOk("Relación creada correctamente");

      await loadAll();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Error al crear la relación"
      );
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar esta relación?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setOk("");

      await api.delete(`/group-subjects/${id}`);

      setOk("Relación eliminada correctamente");

      await loadAll();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar la relación");
    }
  }

  function exportPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Relación Grupo - Asignatura", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["ID", "Grupo", "Asignatura"]],
      body: relations.map((r) => [
        r.id,
        r.group_name || r.group || "-",
        r.subject_name || r.subject || "-",
      ]),
    });

    doc.save("grupo_asignaturas.pdf");
  }

  return (
    <div className="container mt-4">
      <h2>Relación Grupo - Asignatura</h2>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {ok && <div className="alert alert-success mt-3">{ok}</div>}

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="mb-3">Asignar asignatura a grupo</h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label">Grupo</label>

                <select
                  className="form-select"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                >
                  <option value="">Seleccionar grupo</option>

                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} {g.year ? `- ${g.year}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-5">
                <label className="form-label">Asignatura</label>

                <select
                  className="form-select"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                >
                  <option value="">Seleccionar asignatura</option>

                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.code ? `(${s.code})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button className="btn btn-primary w-100" type="submit">
                  Asignar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Listado de relaciones</h5>

            <button className="btn btn-danger" onClick={exportPDF}>
              Exportar PDF
            </button>
          </div>

          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Grupo</th>
                <th>Asignatura</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {relations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No hay relaciones registradas
                  </td>
                </tr>
              ) : (
                relations.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.group_name || r.group || "-"}</td>
                    <td>{r.subject_name || r.subject || "-"}</td>

                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(r.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}