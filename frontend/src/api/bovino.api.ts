import axiosInstance from "./axios.config";
import type {
  Bovino,
  RegistroSanitario,
  RegistroReproductivo,
} from "../types/bovino.types";

export const bovinoApi = {
  // Listar bovinos del usuario
  list: async (): Promise<Bovino[]> => {
    const response = await axiosInstance.get("/bovinos");
    return response.data.data.bovinos;
  },

  // Crear bovino
  create: async (data: Partial<Bovino>): Promise<number> => {
    const response = await axiosInstance.post("/bovinos", data);
    return response.data.data.id;
  },

  // Obtener por ID
  getById: async (id: number): Promise<Bovino> => {
    const response = await axiosInstance.get(`/bovinos/${id}`);
    return response.data.data.bovino;
  },

  // Actualizar
  update: async (id: number, data: Partial<Bovino>): Promise<void> => {
    await axiosInstance.put(`/bovinos/${id}`, data);
  },

  // Eliminar
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/bovinos/${id}`);
  },

  // Subir fotos
  uploadFotos: async (id: number, files: File[]): Promise<void> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("fotos", file));

    await axiosInstance.post(`/bovinos/${id}/fotos`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Historial sanitario
  addSanitario: async (
    id: number,
    data: Partial<RegistroSanitario>
  ): Promise<void> => {
    await axiosInstance.post(`/bovinos/${id}/sanitario`, data);
  },

  getSanitario: async (id: number): Promise<RegistroSanitario[]> => {
    const response = await axiosInstance.get(`/bovinos/${id}/sanitario`);
    return response.data.data.historial;
  },

  // Historial reproductivo
  addReproductivo: async (
    id: number,
    data: Partial<RegistroReproductivo>
  ): Promise<void> => {
    await axiosInstance.post(`/bovinos/${id}/reproductivo`, data);
  },

  getReproductivo: async (id: number): Promise<RegistroReproductivo[]> => {
    const response = await axiosInstance.get(`/bovinos/${id}/reproductivo`);
    return response.data.data.historial;
  },
};
