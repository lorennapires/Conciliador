import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 60000,
});

export async function uploadPlanilha(file: File, valor: string) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("valor", valor);

  const response = await api.post("/conciliar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}