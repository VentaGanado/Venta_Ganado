import React from 'react';
import { Link } from 'react-router-dom';
import type { Bovino } from '../../types/bovino.types';

interface BovinoCardProps {
  bovino: Bovino;
  onEdit?: () => void;
  onDelete?: () => void;
  onPublicar?: () => void;
}

const API_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:3000/uploads';

export const BovinoCard: React.FC<BovinoCardProps> = ({ bovino, onEdit, onDelete, onPublicar }) => {
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
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1">
      {/* Imagen */}
      <div className="relative h-52 bg-gradient-to-br from-green-100 to-green-200 overflow-hidden">
        {bovino.foto_principal ? (
          <img
            src={`${API_URL}/${bovino.foto_principal}`}
            alt={bovino.raza}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-7xl opacity-60">🐄</div>
        )}
        
        {/* Badge de estado */}
        {bovino.estado && (
          <div className={`absolute top-3 right-3 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg ${estadoBadge[bovino.estado]}`}>
            {bovino.estado}
          </div>
        )}

        {/* Código interno badge */}
        {bovino.codigo_interno && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            #{bovino.codigo_interno}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div className="mb-4">
          {bovino.nombre && (
            <p className="text-sm text-green-600 font-bold mb-1 flex items-center gap-1">
              <span>🏷️</span> {bovino.nombre}
            </p>
          )}
          <h3 className="text-2xl font-extrabold text-gray-800 mb-2">{bovino.raza}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span className="font-semibold">{bovino.sexo === 'M' ? '♂️ Macho' : '♀️ Hembra'}</span>
            <span className="text-gray-400">•</span>
            <span>{bovino.fecha_nacimiento ? calcularEdad(bovino.fecha_nacimiento) : bovino.edad ? `${bovino.edad} años` : 'N/A'}</span>
          </p>
        </div>

        {/* Detalles en Grid */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">⚖️</span>
              <p className="text-xs text-blue-700 font-semibold">Peso</p>
            </div>
            <p className="font-extrabold text-blue-900 text-lg">{bovino.peso || bovino.peso_actual || 'N/A'} kg</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📍</span>
              <p className="text-xs text-purple-700 font-semibold">Ubicación</p>
            </div>
            <p className="font-bold text-purple-900 text-sm truncate">{bovino.ubicacion_municipio}</p>
          </div>
        </div>

        {bovino.valor_estimado && (
          <div className="mb-5 p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md">
            <p className="text-xs text-green-100 mb-1 font-semibold">💰 Valor estimado</p>
            <p className="text-3xl font-extrabold text-white">
              ${bovino.valor_estimado.toLocaleString('es-CO')}
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="space-y-3">
          <Link
            to={`/bovinos/${bovino.id}`}
            className="block w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all text-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            👁️ Ver Detalle
          </Link>
          
          <div className="flex gap-2">
            {onPublicar && (
              <button
                onClick={onPublicar}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-xl hover:from-purple-200 hover:to-purple-300 transition-all font-bold text-sm shadow-sm hover:shadow-md border border-purple-300"
                title="Publicar en Marketplace"
              >
                🛒 Publicar
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-xl hover:from-blue-200 hover:to-blue-300 transition-all shadow-sm hover:shadow-md border border-blue-300"
                title="Editar"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-4 py-2.5 bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded-xl hover:from-red-200 hover:to-red-300 transition-all shadow-sm hover:shadow-md border border-red-300"
                title="Eliminar"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};