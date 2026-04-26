import { api } from "./axios";

export async function getGrades() {
  const res = await api.get("/grades");

  if (Array.isArray(res?.data?.data)) {
    return res.data.data;
  }

  if (Array.isArray(res?.data)) {
    return res.data;
  }

  return [];
}

export async function createGrade(payload) {
  const res = await api.post("/grades", payload);
  return res.data;
}

export async function updateGrade(id, payload) {
  const res = await api.put(`/grades/${id}`, payload);
  return res.data;
}

export async function deleteGrade(id) {
  const res = await api.delete(`/grades/${id}`);
  return res.data;
}