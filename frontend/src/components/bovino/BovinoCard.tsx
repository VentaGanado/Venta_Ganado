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
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
      {/* Imagen */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {bovino.foto_principal ? (
          (() => {
            const raw = bovino.foto_principal as string;
            const normalized = raw.startsWith('/uploads/') ? raw.replace(/^\/uploads\//, '') : raw.replace(/^\/+/, '');
            return (
              <img
                src={`${API_URL}/${normalized}`}
                alt={bovino.raza}
                className="w-full h-full object-cover"
              />
            );
          })()
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Badge de estado */}
        {bovino.estado && (
          <div className={`absolute top-2 right-2 px-3 py-1 rounded-md text-xs font-semibold ${estadoBadge[bovino.estado]}`}>
            {bovino.estado}
          </div>
        )}

        {/* Código interno badge */}
        {bovino.codigo_interno && (
          <div className="absolute top-2 left-2 bg-white text-gray-700 px-2 py-1 rounded-md text-xs font-semibold shadow">
            #{bovino.codigo_interno}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        <div className="mb-4">
          {bovino.nombre && (
            <p className="text-sm text-green-600 font-semibold mb-1">
              {bovino.nombre}
            </p>
          )}
          <h3 className="text-xl font-bold text-gray-900 mb-1">{bovino.raza}</h3>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{bovino.sexo === 'M' ? 'Macho' : 'Hembra'}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span>{bovino.fecha_nacimiento ? calcularEdad(bovino.fecha_nacimiento) : bovino.edad ? `${bovino.edad} años` : 'N/A'}</span>
          </p>
        </div>

        {/* Detalles en Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 font-medium mb-1">Peso</p>
            <p className="font-bold text-gray-900 text-base">{bovino.peso || bovino.peso_actual || 'N/A'} kg</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 font-medium mb-1">Ubicación</p>
            <p className="font-semibold text-gray-900 text-sm truncate">{bovino.ubicacion_municipio}</p>
          </div>
        </div>

        {bovino.valor_estimado && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 mb-1 font-medium">Valor estimado</p>
            <p className="text-2xl font-bold text-green-800">
              ${bovino.valor_estimado.toLocaleString('es-CO')}
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="space-y-2">
          <Link
            to={`/bovinos/${bovino.id}`}
            className="block w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2.5 rounded-lg font-semibold transition-all text-center text-sm shadow-sm hover:shadow-md"
          >
            Ver Detalle
          </Link>
          
          <div className="flex gap-2">
            {onPublicar && (
              <button
                onClick={onPublicar}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all font-medium text-sm border border-gray-300"
                title="Publicar en Marketplace"
              >
                Publicar
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all border border-gray-300"
                title="Editar"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all border border-red-200"
                title="Eliminar"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
