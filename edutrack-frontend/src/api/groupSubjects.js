import { api } from "./axios";

export async function getGroupSubjects() {
  const { data } = await api.get("/group-subjects");
  return data.data;
}

export async function createGroupSubject(payload) {
  await api.post("/group-subjects", payload);
}

export async function deleteGroupSubject(id) {
  await api.delete(`/group-subjects/${id}`);
}