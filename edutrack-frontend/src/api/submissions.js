import { api } from "./axios";

export async function getSubmissions(){
  const {data} = await api.get("/submissions");
  return data.data;
}

export async function deleteSubmission(id){
  await api.delete(`/submissions/${id}`);
}