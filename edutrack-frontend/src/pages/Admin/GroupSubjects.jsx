import { useEffect, useState } from "react";
import { api } from "../../api/axios";

export default function GroupSubjects() {
  const [relations, setRelations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [groupId, setGroupId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [error, setError] = useState("");

  async function loadData() {
    try {
      const gs = await api.get("/group-subjects");
      const g = await api.get("/groups");
      const s = await api.get("/subjects");

      setRelations(gs.data.data);
      setGroups(g.data.data);
      setSubjects(s.data.data);
    } catch {
      setError("Error cargando datos");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();

    try {
      await api.post("/group-subjects", {
        group_id: groupId,
        subject_id: subjectId,
      });

      setGroupId("");
      setSubjectId("");
      loadData();
    } catch {
      setError("No se pudo crear la relación");
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar relación?")) return;

    try {
      await api.delete(`/group-subjects/${id}`);
      loadData();
    } catch {
      setError("No se pudo eliminar");
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Relación Grupo - Asignatura</h2>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Crear relación */}
      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <select
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

        <select
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

        <button type="submit">Añadir</button>
      </form>

      {/* Tabla */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Grupo</th>
            <th>Asignatura</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {relations.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.group_name}</td>
              <td>{r.subject_name}</td>
              <td>
                <button onClick={() => handleDelete(r.id)}>Eliminar</button>
              </td>
            </tr>
          ))}

          {relations.length === 0 && (
            <tr>
              <td colSpan="4">No hay relaciones</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}