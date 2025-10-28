import { useState } from 'react';
import { marketplaceApi } from '../api/marketplace.api';
import type {
  Publicacion,
  FiltrosMarketplace,
  OrdenamientoMarketplace,
  PaginacionMarketplace,
  CrearPublicacionData,
  ActualizarPublicacionData,
} from '../types/marketplace.types';

export const useMarketplace = () => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginacion, setPaginacion] = useState<PaginacionMarketplace>({
    pagina: 1,
    porPagina: 12,
    total: 0,
    totalPaginas: 0,
  });

  const cargarPublicaciones = async (
    filtros?: FiltrosMarketplace,
    ordenamiento?: OrdenamientoMarketplace,
    pagina: number = 1
  ) => {
    try {
      setLoading(true);
      setError(null);

      const resultado = await marketplaceApi.obtenerPublicaciones(
        filtros,
        ordenamiento,
        pagina,
        paginacion.porPagina
      );

      setPublicaciones(resultado.publicaciones);
      setPaginacion(resultado.paginacion);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al cargar publicaciones';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerPublicacion = async (id: number): Promise<Publicacion | null> => {
    try {
      setLoading(true);
      setError(null);
      const publicacion = await marketplaceApi.obtenerPublicacion(id);
      return publicacion;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al cargar la publicación';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const crearPublicacion = async (datos: CrearPublicacionData): Promise<Publicacion | null> => {
    try {
      setLoading(true);
      setError(null);
      const publicacion = await marketplaceApi.crearPublicacion(datos);
      return publicacion;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al crear la publicación';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const actualizarPublicacion = async (
    id: number,
    datos: ActualizarPublicacionData
  ): Promise<Publicacion | null> => {
    try {
      setLoading(true);
      setError(null);
      const publicacion = await marketplaceApi.actualizarPublicacion(id, datos);
      return publicacion;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al actualizar la publicación';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const togglePublicacion = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await marketplaceApi.togglePublicacion(id);
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al cambiar el estado de la publicación';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const eliminarPublicacion = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await marketplaceApi.eliminarPublicacion(id);
      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al eliminar la publicación';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    publicaciones,
    loading,
    error,
    paginacion,
    cargarPublicaciones,
    obtenerPublicacion,
    crearPublicacion,
    actualizarPublicacion,
    togglePublicacion,
    eliminarPublicacion,
    setError,
  };
};
