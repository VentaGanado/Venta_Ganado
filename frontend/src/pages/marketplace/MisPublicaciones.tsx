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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Mis Publicaciones</h1>
          <p className="text-gray-600">Gestiona tus bovinos publicados en el marketplace</p>
        </div>

        {/* Error */}
        {(error || errorData) && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-start gap-3">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error || errorData}</span>
          </div>
        )}

        {/* Loading */}
        {loadingData ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-700">Cargando publicaciones...</p>
            </div>
          </div>
        ) : publicaciones.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
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
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Imagen */}
                  <div className="w-full md:w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
                      <div className="flex items-center justify-center h-full">
                        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Información */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {publicacion.titulo}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Publicado el {formatFecha(publicacion.fecha_creacion)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                            publicacion.activo
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {publicacion.activo ? (
                            <>
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Activa
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                              </svg>
                              Inactiva
                            </>
                          )}
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
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        {publicacion.activo ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            Desactivar
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Activar
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => window.location.href = `/marketplace/${publicacion.id}`}
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver Publicación
                      </Button>
                      <button
                        onClick={() => handleEliminar(publicacion.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center"
                        disabled={loading}
                        title="Eliminar publicación"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
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
