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
    setPaginaActual(1); // Resetear a página 1 al cambiar filtros
  };

  const handleLimpiarFiltros = () => {
    setFiltros({});
    setPaginaActual(1);
  };

  const handleOrdenamientoChange = (campo: OrdenamientoMarketplace['campo']) => {
    setOrdenamiento((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handlePaginaChange = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Marketplace Ganadero
          </h1>
          <p className="text-gray-600">
            Encuentra el bovino ideal para tu finca
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <FiltrosMarketplaceComponent
            filtros={filtros}
            onFiltrosChange={handleFiltrosChange}
            onLimpiar={handleLimpiarFiltros}
          />
        </div>

        {/* Barra de resultados y ordenamiento */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Contador de resultados */}
            <div className="text-gray-700">
              {paginacion?.total > 0 ? (
                <span className="text-sm md:text-base">
                  Mostrando <span className="font-semibold text-green-600">{publicaciones?.length || 0}</span> de{' '}
                  <span className="font-semibold">{paginacion.total}</span> publicaciones
                </span>
              ) : (
                <span className="text-sm md:text-base text-gray-500">No se encontraron publicaciones</span>
              )}
            </div>

            {/* Controles de ordenamiento */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Ordenar por:
              </label>
              <select
                value={ordenamiento.campo}
                onChange={(e) => handleOrdenamientoChange(e.target.value as OrdenamientoMarketplace['campo'])}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              >
                <option value="fecha_creacion">Fecha de publicación</option>
                <option value="precio">Precio</option>
                <option value="relevancia">Relevancia</option>
              </select>

              <button
                onClick={() =>
                  setOrdenamiento((prev) => ({
                    ...prev,
                    direccion: prev.direccion === 'asc' ? 'desc' : 'asc',
                }))
                }
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title={ordenamiento.direccion === 'asc' ? 'Ascendente' : 'Descendente'}
              >
                <svg 
                  className={`w-5 h-5 text-gray-600 transition-transform ${ordenamiento.direccion === 'desc' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-start">
              <svg className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent mb-3"></div>
            <p className="text-gray-600 text-sm font-medium">Cargando publicaciones...</p>
          </div>
        ) : publicaciones && publicaciones.length > 0 ? (
          <>
            {/* Grid de publicaciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {publicaciones.map((publicacion) => (
                <PublicacionCard key={publicacion.id} publicacion={publicacion} />
              ))}
            </div>

            {/* Paginación */}
            {paginacion && paginacion.totalPaginas > 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Botón anterior */}
                  <button
                    onClick={() => handlePaginaChange(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="w-full sm:w-auto px-5 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    ← Anterior
                  </button>

                  {/* Números de página */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: Math.min(paginacion.totalPaginas, 5) }, (_, i) => {
                      let pageNum;
                      if (paginacion.totalPaginas <= 5) {
                        pageNum = i + 1;
                      } else if (paginaActual <= 3) {
                        pageNum = i + 1;
                      } else if (paginaActual >= paginacion.totalPaginas - 2) {
                        pageNum = paginacion.totalPaginas - 4 + i;
                      } else {
                        pageNum = paginaActual - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePaginaChange(pageNum)}
                          className={`w-9 h-9 text-sm rounded-lg font-medium transition-colors ${
                            pageNum === paginaActual
                              ? 'bg-green-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Botón siguiente */}
                  <button
                    onClick={() => handlePaginaChange(paginaActual + 1)}
                    disabled={paginaActual === paginacion.totalPaginas}
                    className="w-full sm:w-auto px-5 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Estado vacío */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No se encontraron publicaciones
            </h3>
            <p className="text-gray-600 text-sm mb-5">
              Intenta ajustar los filtros o realizar una búsqueda diferente
            </p>
            <button
              onClick={handleLimpiarFiltros}
              className="px-5 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};