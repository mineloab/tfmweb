import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import { createGrade, getGrades, updateGrade } from "../../api/grades";

export default function Submissions() {
  const { user } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);

  const [taskId, setTaskId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [gradesMap, setGradesMap] = useState({});

  async function loadAll() {
    try {
      const [subs, tasksRes, usersRes, gradesRes] = await Promise.all([
        api.get("/submissions"),
        api.get("/tasks"),
        api.get("/users"),
        getGrades(),
      ]);

      setSubmissions(subs.data.data || []);
      setTasks(tasksRes.data.data || []);
      setStudents(usersRes.data.data || []);

      const map = {};
      gradesRes.data?.forEach((g) => {
        map[g.submission_id] = g;
      });

      setGradesMap(map);
    } catch (err) {
      setError("Error cargando datos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return <div>Submissions funcionando</div>;
}