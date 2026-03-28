import { api } from "./axios";

export async function getEnrollments() {
  const { data } = await api.get("/enrollments");
  return data.data;
}

export async function createEnrollment(payload) {
  await api.post("/enrollments", payload);
}

export async function deleteEnrollment(id) {
  await api.delete(`/enrollments/${id}`);
}