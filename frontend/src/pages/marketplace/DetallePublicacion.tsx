import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { useMarketplace } from '../../hooks/useMarketplace';
import type { Publicacion } from '../../types/marketplace.types';

export const DetallePublicacion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { obtenerPublicacion, loading, error } = useMarketplace();

  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);

  useEffect(() => {
    if (id) {
      cargarPublicacion();
    }
  }, [id]);

  const cargarPublicacion = async () => {
    if (!id) return;
    const result = await obtenerPublicacion(Number(id));
    setPublicacion(result);
  };

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  const getFotoUrl = () => {
    if (publicacion?.bovino?.foto_principal) {
      return `${import.meta.env.VITE_UPLOADS_URL}/${publicacion.bovino.foto_principal}`;
    }
    return 'https://via.placeholder.com/600x400?text=Sin+Foto';
  };

  const getSexoLabel = (sexo: 'M' | 'F') => {
    return sexo === 'M' ? 'Macho' : 'Hembra';
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleContactar = () => {
    if (publicacion?.vendedor?.telefono) {
      window.open(`https://wa.me/57${publicacion.vendedor.telefono}`, '_blank');
    } else {
      alert('El vendedor no ha proporcionado un número de teléfono');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !publicacion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Publicación no encontrada</h3>
            <p className="text-gray-600 mb-6">{error || 'La publicación que buscas no existe'}</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Volver al Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { bovino, vendedor } = publicacion;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => navigate('/')} className="hover:text-green-600">
            Inicio
          </button>
          <span>/</span>
          <button onClick={() => navigate('/marketplace')} className="hover:text-green-600">
            Marketplace
          </button>
          <span>/</span>
          <span className="text-gray-800">{publicacion.titulo}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda: Imagen y descripción */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen principal */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={getFotoUrl()} alt={publicacion.titulo} className="w-full h-96 object-cover" />
            </div>

            {/* Información del bovino */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{publicacion.titulo}</h1>

              {bovino && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Raza</p>
                    <p className="text-lg font-bold text-gray-800">{bovino.raza}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Sexo</p>
                    <p className="text-lg font-bold text-gray-800">{getSexoLabel(bovino.sexo)}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Edad</p>
                    <p className="text-lg font-bold text-gray-800">{bovino.edad} años</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Peso</p>
                    <p className="text-lg font-bold text-gray-800">{bovino.peso} kg</p>
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Descripción</h2>
                <p className="text-gray-700 whitespace-pre-line">{publicacion.descripcion}</p>
              </div>

              {bovino?.descripcion && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    Información adicional del bovino
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">{bovino.descripcion}</p>
                </div>
              )}

              {bovino?.ubicacion_municipio && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Ubicación</h2>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>
                      {bovino.ubicacion_municipio}, {bovino.ubicacion_departamento || 'Boyacá'}
                    </span>
                  </div>
                </div>
              )}

              {bovino?.estado_sanitario && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Estado sanitario</h2>
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    {bovino.estado_sanitario}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha: Precio y vendedor */}
          <div className="space-y-6">
            {/* Card de precio */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Precio</p>
                <p className="text-4xl font-bold text-green-600">{formatPrecio(publicacion.precio)}</p>
              </div>

              {!publicacion.activo && (
                <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  Esta publicación está inactiva
                </div>
              )}

              <button
                onClick={handleContactar}
                disabled={!publicacion.activo}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contactar vendedor
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Te contactaremos por WhatsApp
              </p>
            </div>

            {/* Card del vendedor */}
            {vendedor && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Vendedor</h3>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-2xl flex-shrink-0">
                    {vendedor.nombre[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-lg">
                      {vendedor.nombre} {vendedor.apellidos}
                    </p>
                    {vendedor.municipio && (
                      <p className="text-sm text-gray-600">
                        {vendedor.municipio}, {vendedor.departamento || 'Boyacá'}
                      </p>
                    )}
                  </div>
                </div>

                {vendedor.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{vendedor.email}</span>
                  </div>
                )}

                {vendedor.telefono && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{vendedor.telefono}</span>
                  </div>
                )}
              </div>
            )}

            {/* Información de la publicación */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Detalles de la publicación</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Publicado el:</span>
                  <span className="text-gray-800 font-medium">
                    {formatFecha(publicacion.fecha_creacion)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de publicación:</span>
                  <span className="text-gray-800 font-medium">#{publicacion.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
