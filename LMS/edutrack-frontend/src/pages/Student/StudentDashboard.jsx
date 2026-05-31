import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

export default function StudentDashboard() {

  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    try {

      const res = await api.get(`/student/${user.id}`);

      setTasks(res.data.tasks || []);
      setGrades(res.data.grades || []);

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Panel del Alumno</h2>

      {/* TAREAS */}

      <div className="card mb-4">
        <div className="card-body">

          <h4>Tareas activas</h4>

          <table className="table table-bordered">

            <thead>
              <tr>
                <th>Tarea</th>
                <th>Descripción</th>
                <th>Fecha límite</th>
              </tr>
            </thead>

            <tbody>

              {tasks.map((t) => (

                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>{t.description}</td>
                  <td>{t.due_date}</td>
                </tr>

              ))}

            </tbody>

          </table>

        </div>
      </div>

      {/* NOTAS */}

      <div className="card">
        <div className="card-body">

          <h4>Mis notas</h4>

          <table className="table table-striped">

            <thead>
              <tr>
                <th>Tarea</th>
                <th>Archivo</th>
                <th>Fecha entrega</th>
                <th>Nota</th>
                <th>Comentario profesor</th>
              </tr>
            </thead>

            <tbody>

              {grades.map((g, index) => (

                <tr key={index}>

                  <td>{g.title}</td>

                  <td>
                    <a
                      href={`http://localhost/edutrack-api/uploads/${g.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Descargar
                    </a>
                  </td>

                  <td>{g.submitted_at}</td>

                  <td>
                    {g.grade ?? "-"}
                  </td>

                  <td>
                    {g.feedback ?? "-"}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}