import { useEffect, useState } from "react";
import { createGroup, deleteGroup, getGroups, updateGroup } from "../../api/groups";

export default function Groups() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(null); // {id, name, year}

  async function load() {
    setLoading(true);
    setError("");
    try {
      const rows = await getGroups();
      setItems(rows);
    } catch (e) {
      setError("No se pudieron cargar los grupos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setError("");
    try {
      const created = await createGroup({ name, year });
      setItems((prev) => [created, ...prev]);
      setName("");
      setYear("");
    } catch (e) {
      setError(e?.response?.data?.error ?? "Error creando el grupo.");
    }
  }

  function startEdit(g) {
    setEditing({ id: g.id, name: g.name ?? "", year: g.year ?? "" });
    setError("");
  }

  async function onSaveEdit(e) {
    e.preventDefault();
    if (!editing) return;
    setError("");
    try {
      const updated = await updateGroup(editing.id, { name: editing.name, year: editing.year });
      setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setEditing(null);
    } catch (e) {
      setError(e?.response?.data?.error ?? "Error actualizando el grupo.");
    }
  }

  async function onDelete(id) {
    if (!confirm("¿Eliminar este grupo?")) return;
    setError("");
    try {
      await deleteGroup(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      setError(e?.response?.data?.error ?? "Error eliminando el grupo.");
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h2>Grupos</h2>

      {error && <div style={{ color: "crimson", margin: "10px 0" }}>{error}</div>}

      {/* Crear */}
      <form onSubmit={onCreate} style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre (ej. DAW2)"
          style={{ padding: 8, flex: 1 }}
        />
        <input
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Curso (ej. 2025/2026)"
          style={{ padding: 8, width: 180 }}
        />
        <button style={{ padding: "8px 14px" }}>Crear</button>
      </form>

      {/* Editar */}
      {editing && (
        <form onSubmit={onSaveEdit} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
          <b>Editando grupo #{editing.id}</b>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              value={editing.name}
              onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
              style={{ padding: 8, flex: 1 }}
            />
            <input
              value={editing.year}
              onChange={(e) => setEditing((p) => ({ ...p, year: e.target.value }))}
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
              <th>Curso</th>
              <th style={{ width: 210 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((g) => (
              <tr key={g.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{g.id}</td>
                <td>{g.name}</td>
                <td>{g.year ?? "-"}</td>
                <td>
                  <button onClick={() => startEdit(g)} style={{ marginRight: 8 }}>
                    Editar
                  </button>
                  <button onClick={() => onDelete(g.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4}>No hay grupos.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}