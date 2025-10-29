import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/common/Button';
import { useMarketplace } from '../../hooks/useMarketplace';
import { marketplaceApi } from '../../api/marketplace.api';
import type { Publicacion } from '../../types/marketplace.types';

const API_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:3000/uploads';

export const MisPublicaciones: React.FC = () => {
  const { loading, error, togglePublicacion, eliminarPublicacion } = useMarketplace();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | null>(null);

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  const cargarPublicaciones = async () => {
    try {
      setLoadingData(true);
      setErrorData(null);
      const data = await marketplaceApi.obtenerMisPublicaciones();
      console.log('Publicaciones recibidas:', data);
      setPublicaciones(data || []);
    } catch (err: any) {
      console.error('Error al cargar publicaciones:', err);
      setErrorData(err.response?.data?.error || 'Error al cargar las publicaciones');
    } finally {
      setLoadingData(false);
    }
  };

  const handleToggle = async (id: number) => {
    const success = await togglePublicacion(id);
    if (success) {
      // Recargar las publicaciones para obtener el estado actualizado
      await cargarPublicaciones();
    }
  };

  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta publicación? Esta acción no se puede deshacer.')) {
      const success = await eliminarPublicacion(id);
      if (success) {
        // Recargar las publicaciones
        await cargarPublicaciones();
      }
    }
  };

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mis Publicaciones</h1>
          <p className="text-gray-600">Gestiona tus bovinos publicados en el marketplace</p>
        </div>

        {/* Error */}
        {(error || errorData) && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error || errorData}
          </div>
        )}

        {/* Loading */}
        {loadingData ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : publicaciones.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <div className="text-8xl mb-4">📢</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No tienes publicaciones activas
            </h3>
            <p className="text-gray-600 mb-6">
              Ve a "Mis Bovinos" para publicar un bovino en el marketplace
            </p>
            <Button
              onClick={() => window.location.href = '/bovinos'}
              variant="primary"
            >
              Ir a Mis Bovinos
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {publicaciones.map((publicacion) => (
              <div
                key={publicacion.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Imagen */}
                  <div className="w-full md:w-48 h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden flex-shrink-0">
                    {publicacion.bovino?.foto_principal ? (
                      (() => {
                        const raw = publicacion.bovino!.foto_principal as string;
                        const normalized = raw.startsWith('/uploads/') ? raw.replace(/^\/uploads\//, '') : raw.replace(/^\/+/, '');
                        return (
                          <img
                            src={`${API_URL}/${normalized}`}
                            alt={publicacion.titulo}
                            className="w-full h-full object-cover"
                          />
                        );
                      })()
                    ) : (
                      <div className="flex items-center justify-center h-full text-6xl">🐄</div>
                    )}
                  </div>

                  {/* Información */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">
                          {publicacion.titulo}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Publicado el {formatFecha(publicacion.fecha_creacion)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            publicacion.activo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {publicacion.activo ? '✓ Activa' : '✕ Inactiva'}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {publicacion.descripcion}
                    </p>

                    {/* Detalles del bovino */}
                    {publicacion.bovino && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500">Raza</p>
                          <p className="font-semibold text-gray-800">{publicacion.bovino.raza}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Sexo</p>
                          <p className="font-semibold text-gray-800">
                            {publicacion.bovino.sexo === 'M' ? 'Macho' : 'Hembra'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Edad</p>
                          <p className="font-semibold text-gray-800">{publicacion.bovino.edad} años</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Peso</p>
                          <p className="font-semibold text-gray-800">{publicacion.bovino.peso} kg</p>
                        </div>
                      </div>
                    )}

                    {/* Precio */}
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-green-600">
                        {formatPrecio(publicacion.precio)}
                      </p>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleToggle(publicacion.id)}
                        variant={publicacion.activo ? 'outline' : 'primary'}
                        loading={loading}
                        className="flex-1"
                      >
                        {publicacion.activo ? '🔒 Desactivar' : '✓ Activar'}
                      </Button>
                      <Button
                        onClick={() => window.location.href = `/marketplace/${publicacion.id}`}
                        variant="outline"
                        className="flex-1"
                      >
                        👁️ Ver Publicación
                      </Button>
                      <button
                        onClick={() => handleEliminar(publicacion.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
                        disabled={loading}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
