import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import { createGrade, getGrades, updateGrade } from "../../api/grades";

export default function Submissions() {
  const { user } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [gradesMap, setGradesMap] = useState({});
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeValue, setGradeValue] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      setError("");

      const submissionsRes = await api.get("/submissions");
      const gradesRes = await getGrades();

      const submissionsData = Array.isArray(submissionsRes?.data?.data)
        ? submissionsRes.data.data
        : Array.isArray(submissionsRes?.data)
        ? submissionsRes.data
        : [];

      const gradesData = Array.isArray(gradesRes)
        ? gradesRes
        : Array.isArray(gradesRes?.data)
        ? gradesRes.data
        : [];

      const map = {};
      gradesData.forEach((g) => {
        map[Number(g.submission_id)] = {
          id: g.id,
          grade: g.grade ?? g.score,
          feedback: g.feedback,
        };
      });

      setSubmissions(submissionsData);
      setGradesMap(map);
    } catch (err) {
      console.error(err);
      setError("Error al cargar entregas o notas");
    }
  }

  function getGradeForSubmission(submission) {
    return (
      gradesMap[Number(submission.id)] ||
      (submission.grade !== null && submission.grade !== undefined
        ? {
            id: submission.grade_id,
            grade: submission.grade ?? submission.score,
            feedback: submission.feedback,
          }
        : null)
    );
  }

  function openGradeModal(submission) {
    const existing = getGradeForSubmission(submission);

    setSelectedSubmission(submission);
    setGradeValue(existing?.grade ?? "");
    setFeedback(existing?.feedback ?? "");
    setShowModal(true);
    setError("");
    setOk("");
  }

  function closeGradeModal() {
    setShowModal(false);
    setSelectedSubmission(null);
    setGradeValue("");
    setFeedback("");
  }

  async function saveGrade(e) {
    e.preventDefault();

    if (!selectedSubmission) return;

    const numericGrade = Number(gradeValue);

    if (gradeValue === "" || Number.isNaN(numericGrade)) {
      setError("La nota es obligatoria");
      return;
    }

    if (numericGrade < 0 || numericGrade > 10) {
      setError("La nota debe estar entre 0 y 10");
      return;
    }

    try {
      setError("");
      setOk("");

      const existing = getGradeForSubmission(selectedSubmission);

      if (existing?.id) {
        await updateGrade(existing.id, {
          grade: numericGrade,
          feedback,
        });
        setOk("Nota actualizada correctamente");
      } else {
        await createGrade({
          submission_id: selectedSubmission.id,
          teacher_id: user?.id ?? 1,
          grade: numericGrade,
          feedback,
        });
        setOk("Nota creada correctamente");
      }

      closeGradeModal();
      await loadAll();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Error al guardar la nota"
      );
    }
  }

  async function deleteSubmission(id) {
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar esta entrega?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/submissions/${id}`);
      setOk("Entrega eliminada correctamente");
      await loadAll();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar la entrega");
    }
  }

  return (
    <div className="container mt-4">
      <h2>Entregas con notas</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {ok && <div className="alert alert-success">{ok}</div>}

      <div className="card">
        <div className="card-body">
          <h5 className="mb-3">Listado de entregas</h5>

          <table className="table table-striped table-bordered align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tarea</th>
                <th>Alumno</th>
                <th>Archivo</th>
                <th>Fecha</th>
                <th>Nota</th>
                <th>Feedback</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No hay entregas registradas
                  </td>
                </tr>
              ) : (
                submissions.map((s) => {
                  const grade = getGradeForSubmission(s);

                  return (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.task_title || s.task || "-"}</td>
                      <td>{s.student_name || s.student || "-"}</td>
                      <td>
                        {s.file_path ? (
                          <a
                            href={`http://localhost/edutrack-api/uploads/${s.file_path}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Descargar
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{s.submitted_at || "-"}</td>
                      <td>{grade?.grade ?? "-"}</td>
                      <td>{grade?.feedback || "-"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => openGradeModal(s)}
                        >
                          {grade ? "Editar nota" : "Calificar"}
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteSubmission(s.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={saveGrade}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {getGradeForSubmission(selectedSubmission)
                      ? "Editar nota"
                      : "Calificar entrega"}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeGradeModal}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label>Nota</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.01"
                      className="form-control"
                      value={gradeValue}
                      onChange={(e) => setGradeValue(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label>Feedback</label>
                    <textarea
                      className="form-control"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeGradeModal}
                  >
                    Cancelar
                  </button>

                  <button type="submit" className="btn btn-primary">
                    Guardar nota
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}