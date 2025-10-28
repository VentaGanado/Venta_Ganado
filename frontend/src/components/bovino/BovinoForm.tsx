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
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
      <div className="border-b-2 border-green-200 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
          {bovino ? '✏️ Editar Bovino' : '➕ Registrar Nuevo Bovino'}
        </h2>
        <p className="text-gray-600 mt-2">
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">Raza *</label>
          <select
            name="raza"
            value={formData.raza}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-green-400"
          >
            <option value="">Selecciona la raza</option>
            {RAZAS.map(raza => (
              <option key={raza} value={raza}>{raza}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sexo *</label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-green-400"
          >
            <option value="M">♂️ Macho</option>
            <option value="F">♀️ Hembra</option>
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">Municipio *</label>
          <select
            name="ubicacion_municipio"
            value={formData.ubicacion_municipio}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:border-green-400"
          >
            <option value="">Selecciona el municipio</option>
            {MUNICIPIOS.map(mun => (
              <option key={mun} value={mun}>{mun}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200">
        <label className="block text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <span className="text-xl">📝</span> Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
          placeholder="Características adicionales del bovino (salud, comportamiento, historial, etc.)..."
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          type="submit" 
          variant="primary" 
          loading={loading} 
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          {bovino ? '💾 Actualizar Bovino' : '➕ Registrar Bovino'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          ❌ Cancelar
        </Button>
      </div>
    </form>
  );
};
