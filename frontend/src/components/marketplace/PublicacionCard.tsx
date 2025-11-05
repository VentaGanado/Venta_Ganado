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
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col h-full"
    >
      {/* Imagen */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={getFotoUrl()}
          alt={publicacion.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badge de estado */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
          publicacion.activo 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-500 text-white'
        }`}>
          {publicacion.activo ? 'Disponible' : 'No disponible'}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">
        {/* Título y precio */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors min-h-[3rem]">
            {publicacion.titulo}
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {formatPrecio(publicacion.precio)}
          </p>
        </div>

        {/* Información del bovino */}
        {bovino && (
          <div className="space-y-3 mb-4 flex-1">
            {/* Raza */}
            <div className="flex items-center text-sm">
              <span className="text-gray-500 font-medium">Raza:</span>
              <span className="ml-2 font-semibold text-gray-900">{bovino.raza}</span>
            </div>

            {/* Grid de detalles */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center bg-gray-50 py-2 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Sexo</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {getSexoLabel(bovino.sexo)}
                </p>
              </div>
              <div className="text-center bg-gray-50 py-2 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Edad</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {bovino.edad} años
                </p>
              </div>
              <div className="text-center bg-gray-50 py-2 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Peso</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {bovino.peso} kg
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 mt-auto space-y-3">
          {/* Ubicación */}
          {bovino?.ubicacion_municipio && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="truncate">{bovino.ubicacion_municipio}, {bovino.ubicacion_departamento || 'Boyacá'}</span>
            </div>
          )}

          {/* Vendedor */}
          {vendedor && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold text-sm flex-shrink-0">
                {vendedor.nombre[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {vendedor.nombre} {vendedor.apellidos}
                </p>
                {vendedor.municipio && (
                  <p className="text-xs text-gray-500 truncate">
                    {vendedor.municipio}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};