import { api } from "../../api/axios";
import { createGrade, getGrades, updateGrade } from "../../api/grades";


export async function getSubmissions() {
  const res = await api.get("/submissions");


  return Array.isArray(res?.data?.data)
    ? res.data.data
    : res.data || [];
}


export async function createSubmission({ task_id, student_id, file }) {
  const formData = new FormData();

  formData.append("task_id", task_id);
  formData.append("student_id", student_id);
  formData.append("file", file);

  const res = await api.post("/submissions", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}


export async function deleteSubmission(id) {
  const res = await api.delete(`/submissions/${id}`);
  return res.data;
}


export async function getSubmissionById(id) {
  const res = await api.get(`/submissions/${id}`);
  return res.data;
}