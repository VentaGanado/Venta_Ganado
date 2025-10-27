import { useState, useEffect } from "react";
import { bovinoApi } from "../api/bovino.api";
import type { Bovino } from "../types/bovino.types";

export const useBovinos = () => {
  const [bovinos, setBovinos] = useState<Bovino[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBovinos = async () => {
    try {
      setLoading(true);
      const data = await bovinoApi.list();
      setBovinos(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al cargar bovinos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBovinos();
  }, []);

  const createBovino = async (data: Partial<Bovino>) => {
    try {
      setLoading(true);
      const id = await bovinoApi.create(data);
      await fetchBovinos();
      return id;
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al crear bovino");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBovino = async (id: number, data: Partial<Bovino>) => {
    try {
      setLoading(true);
      await bovinoApi.update(id, data);
      await fetchBovinos();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al actualizar bovino");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBovino = async (id: number) => {
    try {
      setLoading(true);
      await bovinoApi.delete(id);
      await fetchBovinos();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al eliminar bovino");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    bovinos,
    loading,
    error,
    fetchBovinos,
    createBovino,
    updateBovino,
    deleteBovino,
  };
};
