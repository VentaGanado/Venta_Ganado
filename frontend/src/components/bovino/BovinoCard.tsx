import React from 'react';
import { Link } from 'react-router-dom';
import type { Bovino } from '../../types/bovino.types';

interface BovinoCardProps {
  bovino: Bovino;
  onEdit?: () => void;
  onDelete?: () => void;
}

const API_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:3000/uploads';

export const BovinoCard: React.FC<BovinoCardProps> = ({ bovino, onEdit, onDelete }) => {
  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12 + (hoy.getMonth() - nacimiento.getMonth());
    const años = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;
    return años > 0 ? `${años}a ${mesesRestantes}m` : `${mesesRestantes}m`;
  };

  const estadoBadge = {
    'Disponible': 'bg-green-100 text-green-800',
    'En negociación': 'bg-yellow-100 text-yellow-800',
    'Vendido': 'bg-gray-100 text-gray-800',
    'Retirado': 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-green-50">
      {/* Imagen */}
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200">
        {bovino.foto_principal ? (
          <img
            src={`${API_URL}/${bovino.foto_principal}`}
            alt={bovino.raza}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-6xl">🐄</div>
        )}
        
        {/* Badge de estado */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${estadoBadge[bovino.estado]}`}>
          {bovino.estado}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{bovino.raza}</h3>
            <p className="text-sm text-gray-500">
              {bovino.sexo} • {calcularEdad(bovino.fecha_nacimiento)}
            </p>
          </div>
          {bovino.codigo_interno && (
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              {bovino.codigo_interno}
            </span>
          )}
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚖️</span>
            <div>
              <p className="text-xs text-gray-500">Peso</p>
              <p className="font-semibold text-gray-800">{bovino.peso_actual} kg</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📍</span>
            <div>
              <p className="text-xs text-gray-500">Ubicación</p>
              <p className="font-semibold text-gray-800 truncate">{bovino.ubicacion_municipio}</p>
            </div>
          </div>
        </div>

        {bovino.valor_estimado && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-green-600 mb-1">Valor estimado</p>
            <p className="text-2xl font-bold text-green-700">
              ${bovino.valor_estimado.toLocaleString('es-CO')}
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2">
          <Link
            to={`/bovinos/${bovino.id}`}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition text-center"
          >
            Ver Detalle
          </Link>
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};