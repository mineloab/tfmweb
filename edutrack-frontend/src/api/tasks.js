import { api } from "./axios";

export async function getTasks(){
  const {data} = await api.get("/tasks");
  return data.data;
}

export async function createTask(payload){
  await api.post("/tasks",payload);
}

export async function deleteTask(id){
  await api.delete(`/tasks/${id}`);
}