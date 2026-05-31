import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function Student() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [grades, setGrades] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadStudentData();
  }, []);

  async function loadStudentData() {
    try {
      const res = await api.get(`/student/${user.id}`);

      setTasks(res.data.tasks || []);
      setGrades(res.data.grades || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file || !selectedTask) {
      setMessage("Selecciona tarea y archivo");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("task_id", selectedTask);
      formData.append("student_id", user.id);
      formData.append("file", file);

      await api.post("/submissions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Entrega subida correctamente");
      setFile(null);
      setSelectedTask(null);

      loadStudentData();
    } catch (error) {
      console.error(error);
      setMessage("Error al subir entrega");
    }
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Panel Alumno</h2>

      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      {/* TAREAS */}
      <div className="card mb-4">
        <div className="card-body">
          <h4>Tareas activas</h4>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Fecha límite</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.due_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUBIR ENTREGA */}
      <div className="card mb-4">
        <div className="card-body">
          <h4>Entregar actividad</h4>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                Selecciona tarea
              </label>

              <select
                className="form-select"
                value={selectedTask || ""}
                onChange={(e) => setSelectedTask(e.target.value)}
              >
                <option value="">Selecciona...</option>

                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <button className="btn btn-primary">
              Subir entrega
            </button>
          </form>
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
                <th>Nota</th>
                <th>Feedback</th>
              </tr>
            </thead>

            <tbody>
              {grades.map((grade, index) => (
                <tr key={index}>
                  <td>{grade.title}</td>
                  <td>{grade.grade}</td>
                  <td>{grade.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}