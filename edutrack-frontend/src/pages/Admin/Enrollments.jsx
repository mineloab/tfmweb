import { useEffect, useState } from "react";
import { api } from "../../api/axios";

export default function Enrollments() {

  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);

  const [userId, setUserId] = useState("");
  const [groupId, setGroupId] = useState("");

  const [error, setError] = useState("");

  async function loadData() {

    try {

      const e = await api.get("/enrollments");
      const g = await api.get("/groups");
      const u = await api.get("/users");

      setEnrollments(e.data.data);
      setGroups(g.data.data);
      setStudents(u.data.data);

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

      await api.post("/enrollments", {
        user_id: userId,
        group_id: groupId
      });

      setUserId("");
      setGroupId("");

      loadData();

    } catch {
      setError("No se pudo matricular");
    }

  }

  async function handleDelete(id) {

    if (!confirm("¿Eliminar matrícula?")) return;

    try {

      await api.delete(`/enrollments/${id}`);
      loadData();

    } catch {
      setError("No se pudo eliminar");
    }

  }

  return (

    <div style={{ padding: 16 }}>

      <h2>Matrícula de alumnos</h2>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* FORMULARIO */}

      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>

        <select
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

        <button type="submit">Matricular</button>

      </form>

      {/* TABLA */}

      <table border="1" cellPadding="8">

        <thead>

          <tr>
            <th>ID</th>
            <th>Alumno</th>
            <th>Grupo</th>
            <th>Acciones</th>
          </tr>

        </thead>

        <tbody>

          {enrollments.map((e) => (

            <tr key={e.id}>

              <td>{e.id}</td>
              <td>{e.student}</td>
              <td>{e.group_name}</td>

              <td>
                <button onClick={() => handleDelete(e.id)}>
                  Eliminar
                </button>
              </td>

            </tr>

          ))}

          {enrollments.length === 0 && (

            <tr>
              <td colSpan="4">No hay matrículas</td>
            </tr>

          )}

        </tbody>

      </table>

    </div>

  );

}