import { api } from "./axios";

export async function getSubjects() {
  const { data } = await api.get("/subjects");
  return data.data;
}

export async function createSubject(payload) {
  const { data } = await api.post("/subjects", payload);
  return data.data;
}

export async function updateSubject(id, payload) {
  const { data } = await api.put(`/subjects/${id}`, payload);
  return data.data;
}

export async function deleteSubject(id) {
  const { data } = await api.delete(`/subjects/${id}`);
  return data;
}