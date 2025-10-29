import React from 'react';
import { Link } from 'react-router-dom';
import type { Publicacion } from '../../types/marketplace.types';

interface PublicacionCardProps {
  publicacion: Publicacion;
}

export const PublicacionCard: React.FC<PublicacionCardProps> = ({ publicacion }) => {
  const { bovino, vendedor } = publicacion;

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  const getFotoUrl = () => {
    if (bovino?.foto_principal) {
      const raw = bovino.foto_principal as string;
      const normalized = raw.startsWith('/uploads/') ? raw.replace(/^\/uploads\//, '') : raw.replace(/^\/+/, '');
      return `${import.meta.env.VITE_UPLOADS_URL}/${normalized}`;
    }
    return 'https://via.placeholder.com/400x300?text=Sin+Foto';
  };

  const getSexoLabel = (sexo: 'M' | 'F') => {
    return sexo === 'M' ? 'Macho' : 'Hembra';
  };

  return (
    <Link
      to={`/marketplace/${publicacion.id}`}
      className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2 group"
    >
      {/* Imagen */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={getFotoUrl()}
          alt={publicacion.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!publicacion.activo && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
            ❌ Inactiva
          </div>
        )}
        {publicacion.activo && (
          <div className="absolute top-3 right-3 bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
            ✅ Disponible
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Título y precio */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {publicacion.titulo}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-green-700">
              {formatPrecio(publicacion.precio)}
            </span>
            <span className="text-sm text-gray-500">COP</span>
          </div>
        </div>

        {/* Información del bovino */}
        {bovino && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
              <span className="text-xl">🐮</span>
              <span className="text-sm text-gray-600">Raza:</span>
              <span className="font-bold text-blue-900">{bovino.raza}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-purple-50 px-3 py-2 rounded-lg">
                <span className="text-xs text-purple-600 block">Sexo</span>
                <span className="font-bold text-purple-900">{getSexoLabel(bovino.sexo)}</span>
              </div>
              <div className="bg-orange-50 px-3 py-2 rounded-lg">
                <span className="text-xs text-orange-600 block">Edad</span>
                <span className="font-bold text-orange-900">{bovino.edad} años</span>
              </div>
            </div>
            <div className="bg-green-50 px-3 py-2 rounded-lg flex items-center gap-2">
              <span className="text-xl">⚖️</span>
              <span className="text-sm text-gray-600">Peso:</span>
              <span className="font-bold text-green-900">{bovino.peso} kg</span>
            </div>
          </div>
        )}

        {/* Ubicación */}
        {bovino?.ubicacion_municipio && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 bg-gray-50 px-3 py-2 rounded-lg">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{bovino.ubicacion_municipio}, {bovino.ubicacion_departamento || 'Boyacá'}</span>
          </div>
        )}

        {/* Vendedor */}
        {vendedor && (
          <div className="pt-4 border-t-2 border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              {vendedor.nombre[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">
                {vendedor.nombre} {vendedor.apellidos}
              </p>
              {vendedor.municipio && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span>📍</span> {vendedor.municipio}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};
