import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { Bovino } from '../../types/bovino.types';

interface BovinoFormProps {
  bovino?: Bovino;
  onSubmit: (data: Partial<Bovino>) => Promise<void>;
  onCancel: () => void;
}

const RAZAS = ['Holstein', 'Brahman', 'Angus', 'Hereford', 'Normando', 'Pardo Suizo', 'Jersey', 'Simmental'];
const MUNICIPIOS = ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa', 'Villa de Leyva', 'Moniquirá'];

export const BovinoForm: React.FC<BovinoFormProps> = ({ bovino, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: bovino?.nombre || '',
    raza: bovino?.raza || '',
    sexo: bovino?.sexo || 'M',
    fecha_nacimiento: bovino?.fecha_nacimiento || '',
    peso: bovino?.peso || '',
    precio_estimado: '',
    ubicacion_municipio: bovino?.ubicacion_municipio || '',
    descripcion: bovino?.descripcion || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calcularEdad = (fechaNacimiento: string): number | undefined => {
    if (!fechaNacimiento) return undefined;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const edadMs = hoy.getTime() - nacimiento.getTime();
    const edadAnios = Math.floor(edadMs / (1000 * 60 * 60 * 24 * 365.25));
    return edadAnios;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend: any = {
        nombre: formData.nombre || undefined,
        raza: formData.raza,
        sexo: formData.sexo as 'M' | 'F',
        peso: formData.peso ? parseFloat(formData.peso as any) : undefined,
        edad: calcularEdad(formData.fecha_nacimiento),
        ubicacion_municipio: formData.ubicacion_municipio,
        descripcion: formData.descripcion || undefined
      };

      await onSubmit(dataToSend);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-200">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {bovino ? 'Editar bovino' : 'Registrar nuevo bovino'}
        </h2>
        <p className="text-gray-600 mt-1 text-sm">
          {bovino ? 'Actualiza la información del bovino' : 'Completa los datos del nuevo bovino'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre (opcional)"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Rosita"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Raza *</label>
          <select
            name="raza"
            value={formData.raza}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
          >
            <option value="">Selecciona la raza</option>
            {RAZAS.map(raza => (
              <option key={raza} value={raza}>{raza}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sexo *</label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
          >
            <option value="M">Macho</option>
            <option value="F">Hembra</option>
          </select>
        </div>

        <Input
          type="date"
          label="Fecha de Nacimiento *"
          name="fecha_nacimiento"
          value={formData.fecha_nacimiento}
          onChange={handleChange}
          required
        />

        <Input
          type="number"
          label="Peso Actual (kg) *"
          name="peso"
          value={formData.peso}
          onChange={handleChange}
          required
          min="0"
          max="1500"
          step="0.1"
          placeholder="450.5"
        />

        <Input
          type="number"
          label="Precio Estimado (COP)"
          name="precio_estimado"
          value={formData.precio_estimado}
          onChange={handleChange}
          min="0"
          step="100000"
          placeholder="5000000"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Municipio *</label>
          <select
            name="ubicacion_municipio"
            value={formData.ubicacion_municipio}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
          >
            <option value="">Selecciona el municipio</option>
            {MUNICIPIOS.map(mun => (
              <option key={mun} value={mun}>{mun}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
          placeholder="Características adicionales del bovino (salud, comportamiento, historial, etc.)..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          variant="primary" 
          loading={loading} 
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-all"
        >
          {bovino ? 'Actualizar Bovino' : 'Registrar Bovino'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2.5 rounded-lg transition-all"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};
