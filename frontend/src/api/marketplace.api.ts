import axios from './axios.config';
import type {
  Publicacion,
  FiltrosMarketplace,
  OrdenamientoMarketplace,
  RespuestaMarketplace,
  CrearPublicacionData,
  ActualizarPublicacionData,
} from '../types/marketplace.types';

export const marketplaceApi = {
  // Obtener todas las publicaciones con filtros y paginación
  obtenerPublicaciones: async (
    filtros?: FiltrosMarketplace,
    ordenamiento?: OrdenamientoMarketplace,
    pagina: number = 1,
    porPagina: number = 12
  ): Promise<RespuestaMarketplace> => {
    const params = new URLSearchParams();
    
    params.append('pagina', pagina.toString());
    params.append('porPagina', porPagina.toString());
    
    if (ordenamiento) {
      params.append('ordenarPor', ordenamiento.campo);
      params.append('direccion', ordenamiento.direccion);
    }
    
    if (filtros) {
      if (filtros.raza) params.append('raza', filtros.raza);
      if (filtros.sexo) params.append('sexo', filtros.sexo);
      if (filtros.edadMin) params.append('edadMin', filtros.edadMin.toString());
      if (filtros.edadMax) params.append('edadMax', filtros.edadMax.toString());
      if (filtros.pesoMin) params.append('pesoMin', filtros.pesoMin.toString());
      if (filtros.pesoMax) params.append('pesoMax', filtros.pesoMax.toString());
      if (filtros.precioMin) params.append('precioMin', filtros.precioMin.toString());
      if (filtros.precioMax) params.append('precioMax', filtros.precioMax.toString());
      if (filtros.municipio) params.append('municipio', filtros.municipio);
      if (filtros.departamento) params.append('departamento', filtros.departamento);
      if (filtros.vacunasAlDia !== undefined) params.append('vacunasAlDia', filtros.vacunasAlDia.toString());
      if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
    }
    
    const response = await axios.get(`/marketplace?${params.toString()}`);
    return response.data.data;
  },

  // Obtener una publicación específica con todos los detalles
  obtenerPublicacion: async (id: number): Promise<Publicacion> => {
    const response = await axios.get(`/marketplace/${id}`);
    return response.data.data;
  },

  // Crear una nueva publicación
  crearPublicacion: async (datos: CrearPublicacionData): Promise<Publicacion> => {
    const response = await axios.post('/marketplace', datos);
    return response.data.data;
  },

  // Actualizar una publicación existente
  actualizarPublicacion: async (id: number, datos: ActualizarPublicacionData): Promise<Publicacion> => {
    const response = await axios.put(`/marketplace/${id}`, datos);
    return response.data.data;
  },

  // Activar/Desactivar publicación
  togglePublicacion: async (id: number): Promise<Publicacion> => {
    const response = await axios.patch(`/marketplace/${id}/toggle`);
    return response.data.data;
  },

  // Eliminar publicación
  eliminarPublicacion: async (id: number): Promise<void> => {
    await axios.delete(`/marketplace/${id}`);
  },

  // Obtener mis publicaciones
  obtenerMisPublicaciones: async (): Promise<Publicacion[]> => {
    const response = await axios.get('/marketplace/mis-publicaciones');
    return response.data.data;
  },
};
