import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { PublicacionCard } from '../../components/marketplace/PublicacionCard';
import { FiltrosMarketplaceComponent } from '../../components/marketplace/FiltrosMarketplace';
import { useMarketplace } from '../../hooks/useMarketplace';
import type { FiltrosMarketplace, OrdenamientoMarketplace } from '../../types/marketplace.types';

export const Marketplace: React.FC = () => {
  const { publicaciones, loading, error, paginacion, cargarPublicaciones } = useMarketplace();

  const [filtros, setFiltros] = useState<FiltrosMarketplace>({});
  const [ordenamiento, setOrdenamiento] = useState<OrdenamientoMarketplace>({
    campo: 'fecha_creacion',
    direccion: 'desc',
  });
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    cargarPublicaciones(filtros, ordenamiento, paginaActual);
  }, [filtros, ordenamiento, paginaActual]);

  const handleFiltrosChange = (nuevosFiltros: FiltrosMarketplace) => {
    setFiltros(nuevosFiltros);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({});
  };

  const handleOrdenamientoChange = (campo: OrdenamientoMarketplace['campo']) => {
    setOrdenamiento((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handlePaginaChange = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />

  <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-gray-900">Marketplace</h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Encuentra el bovino ideal para tu finca entre nuestras publicaciones.</p>
        </div>

        {/* Filtros */}
        <FiltrosMarketplaceComponent
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          onLimpiar={handleLimpiarFiltros}
        />

        {/* Controles de ordenamiento y resultados */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-gray-700 font-semibold">
            {paginacion?.total > 0 ? (
              <span className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <span>
                  Mostrando <span className="text-green-600 font-bold">{publicaciones?.length || 0}</span> de{' '}
                  <span className="text-blue-600 font-bold">{paginacion.total}</span> publicaciones
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="text-2xl">😕</span>
                <span>No se encontraron publicaciones</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="text-xl">🔍</span>
              Ordenar por:
            </label>
            <select
              value={ordenamiento.campo}
              onChange={(e) =>
                handleOrdenamientoChange(e.target.value as OrdenamientoMarketplace['campo'])
              }
              className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white font-medium hover:border-green-400 transition-all"
            >
              <option value="fecha_creacion">📅 Fecha de publicación</option>
              <option value="precio">💰 Precio</option>
              <option value="relevancia">⭐ Relevancia</option>
            </select>

            <button
              onClick={() =>
                setOrdenamiento((prev) => ({
                  ...prev,
                  direccion: prev.direccion === 'asc' ? 'desc' : 'asc',
                }))
              }
              className="p-3 border-2 border-gray-300 rounded-xl hover:bg-green-50 hover:border-green-400 transition-all shadow-sm hover:shadow-md"
              title={ordenamiento.direccion === 'asc' ? 'Orden ascendente' : 'Orden descendente'}
            >
              <span className="text-xl font-bold">{ordenamiento.direccion === 'asc' ? '↑' : '↓'}</span>
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl shadow-lg flex items-start gap-3">
            <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
              <p className="text-xl font-semibold text-gray-700">Cargando publicaciones...</p>
            </div>
          </div>
        )}

        {/* Grid de publicaciones */}
        {!loading && publicaciones && publicaciones.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {publicaciones.map((publicacion) => (
                <PublicacionCard key={publicacion.id} publicacion={publicacion} />
              ))}
            </div>

            {/* Paginación */}
            {paginacion && paginacion.totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-3 bg-white p-6 rounded-2xl shadow-lg">
                <button
                  onClick={() => handlePaginaChange(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-md hover:shadow-lg font-semibold"
                >
                  ← Anterior
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: paginacion.totalPaginas }, (_, i) => i + 1).map((pagina) => (
                    <button
                      key={pagina}
                      onClick={() => handlePaginaChange(pagina)}
                      className={`px-5 py-3 rounded-xl transition-all font-bold shadow-md ${
                        pagina === paginaActual
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white scale-110 shadow-lg'
                          : 'bg-white border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 text-gray-700'
                      }`}
                    >
                      {pagina}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePaginaChange(paginaActual + 1)}
                  disabled={paginaActual === paginacion.totalPaginas}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-md hover:shadow-lg font-semibold"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}

        {/* Estado vacío */}
        {!loading && (!publicaciones || publicaciones.length === 0) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron publicaciones</h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar los filtros o realizar una búsqueda diferente
            </p>
            <button
              onClick={handleLimpiarFiltros}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
