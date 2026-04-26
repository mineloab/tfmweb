import { useEffect, useState } from "react";
import { createSubject, deleteSubject, getSubjects, updateSubject } from "../../api/subjects";

export default function Subjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(null); // {id, name, code}

  async function load() {
    setLoading(true);
    setError("");
    try {
      const rows = await getSubjects();
      setItems(rows);
    } catch {
      setError("No se pudieron cargar las asignaturas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onCreate(e) {
    e.preventDefault();
    setError("");

    try {
      const created = await createSubject({ name, code });
      setItems((prev) => [created, ...prev]);
      setName("");
      setCode("");
    } catch (e) {
      setError(e?.response?.data?.error ?? "Error creando la asignatura.");
    }
  }

  function startEdit(s) {
    setEditing({ id: s.id, name: s.name ?? "", code: s.code ?? "" });
    setError("");
  }

  async function onSaveEdit(e) {
    e.preventDefault();
    if (!editing) return;
    setError("");

    try {
      const updated = await updateSubject(editing.id, { name: editing.name, code: editing.code });
      setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setEditing(null);
    } catch (e) {
      setError(e?.response?.data?.error ?? "Error actualizando la asignatura.");
    }
  }

  async function onDelete(id) {
    if (!confirm("¿Eliminar esta asignatura?")) return;
    setError("");

    try {
      await deleteSubject(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      setError(e?.response?.data?.error ?? "Error eliminando la asignatura.");
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h2>Asignaturas</h2>

      {error && <div style={{ color: "crimson", margin: "10px 0" }}>{error}</div>}

      {/* Crear */}
      <form onSubmit={onCreate} style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre (ej. Desarrollo Web)"
          style={{ padding: 8, flex: 1 }}
        />
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código (ej. DW)"
          style={{ padding: 8, width: 180 }}
        />
        <button style={{ padding: "8px 14px" }}>Crear</button>
      </form>

      {/* Editar */}
      {editing && (
        <form onSubmit={onSaveEdit} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
          <b>Editando asignatura #{editing.id}</b>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              value={editing.name}
              onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
              style={{ padding: 8, flex: 1 }}
            />
            <input
              value={editing.code}
              onChange={(e) => setEditing((p) => ({ ...p, code: e.target.value }))}
              style={{ padding: 8, width: 180 }}
            />
            <button style={{ padding: "8px 14px" }}>Guardar</button>
            <button type="button" onClick={() => setEditing(null)} style={{ padding: "8px 14px" }}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Listado */}
      {loading ? (
        <div>Cargando…</div>
      ) : (
        <table width="100%" cellPadding="10" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <th>ID</th>
              <th>Nombre</th>
              <th>Código</th>
              <th style={{ width: 210 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.code ?? "-"}</td>
                <td>
                  <button onClick={() => startEdit(s)} style={{ marginRight: 8 }}>Editar</button>
                  <button onClick={() => onDelete(s.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4}>No hay asignaturas.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}