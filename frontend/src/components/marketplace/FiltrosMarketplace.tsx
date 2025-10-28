import React, { useState } from 'react';
import type { FiltrosMarketplace } from '../../types/marketplace.types';

interface FiltrosMarketplaceProps {
  filtros: FiltrosMarketplace;
  onFiltrosChange: (filtros: FiltrosMarketplace) => void;
  onLimpiar: () => void;
}

export const FiltrosMarketplaceComponent: React.FC<FiltrosMarketplaceProps> = ({
  filtros,
  onFiltrosChange,
  onLimpiar,
}) => {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleChange = (campo: keyof FiltrosMarketplace, valor: any) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor === '' ? undefined : valor,
    });
  };

  const razasComunes = [
    'Angus',
    'Brahman',
    'Cebú',
    'Charolais',
    'Hereford',
    'Holstein',
    'Jersey',
    'Limousin',
    'Normando',
    'Pardo Suizo',
    'Romosinuano',
    'Simmental',
  ];

  const municipiosBoyaca = [
    'Tunja',
    'Duitama',
    'Sogamoso',
    'Chiquinquirá',
    'Paipa',
    'Villa de Leyva',
    'Moniquirá',
    'Puerto Boyacá',
    'Ramiriquí',
    'Samacá',
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Header con botón para mostrar/ocultar filtros */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filtros de Búsqueda
        </h3>
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="text-green-600 hover:text-green-700 font-medium text-sm"
        >
          {mostrarFiltros ? 'Ocultar' : 'Mostrar'} filtros
        </button>
      </div>

      {/* Barra de búsqueda (siempre visible) */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por título, descripción, raza..."
          value={filtros.busqueda || ''}
          onChange={(e) => handleChange('busqueda', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Filtros avanzados (colapsables) */}
      {mostrarFiltros && (
        <div className="space-y-4">
          {/* Fila 1: Raza y Sexo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Raza</label>
              <select
                value={filtros.raza || ''}
                onChange={(e) => handleChange('raza', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todas las razas</option>
                {razasComunes.map((raza) => (
                  <option key={raza} value={raza}>
                    {raza}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
              <select
                value={filtros.sexo || ''}
                onChange={(e) => handleChange('sexo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Ambos</option>
                <option value="M">Macho</option>
                <option value="F">Hembra</option>
              </select>
            </div>
          </div>

          {/* Fila 2: Edad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Edad (años)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Mínimo"
                value={filtros.edadMin || ''}
                onChange={(e) => handleChange('edadMin', e.target.value ? Number(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
              />
              <input
                type="number"
                placeholder="Máximo"
                value={filtros.edadMax || ''}
                onChange={(e) => handleChange('edadMax', e.target.value ? Number(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
              />
            </div>
          </div>

          {/* Fila 3: Peso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Mínimo"
                value={filtros.pesoMin || ''}
                onChange={(e) => handleChange('pesoMin', e.target.value ? Number(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
              />
              <input
                type="number"
                placeholder="Máximo"
                value={filtros.pesoMax || ''}
                onChange={(e) => handleChange('pesoMax', e.target.value ? Number(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
              />
            </div>
          </div>

          {/* Fila 4: Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (COP)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Mínimo"
                value={filtros.precioMin || ''}
                onChange={(e) => handleChange('precioMin', e.target.value ? Number(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                step="100000"
              />
              <input
                type="number"
                placeholder="Máximo"
                value={filtros.precioMax || ''}
                onChange={(e) => handleChange('precioMax', e.target.value ? Number(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                step="100000"
              />
            </div>
          </div>

          {/* Fila 5: Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
              <select
                value={filtros.municipio || ''}
                onChange={(e) => handleChange('municipio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todos los municipios</option>
                {municipiosBoyaca.map((municipio) => (
                  <option key={municipio} value={municipio}>
                    {municipio}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <select
                value={filtros.departamento || ''}
                onChange={(e) => handleChange('departamento', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todos los departamentos</option>
                <option value="Boyacá">Boyacá</option>
                <option value="Cundinamarca">Cundinamarca</option>
                <option value="Santander">Santander</option>
              </select>
            </div>
          </div>

          {/* Fila 6: Estado sanitario */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="vacunasAlDia"
              checked={filtros.vacunasAlDia || false}
              onChange={(e) => handleChange('vacunasAlDia', e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="vacunasAlDia" className="ml-2 text-sm text-gray-700">
              Solo bovinos con vacunas al día
            </label>
          </div>

          {/* Botón limpiar filtros */}
          <div className="pt-2">
            <button
              onClick={onLimpiar}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
