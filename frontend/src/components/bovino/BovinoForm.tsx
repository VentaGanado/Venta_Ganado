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
    codigo_interno: bovino?.codigo_interno || '',
    raza: bovino?.raza || '',
    sexo: bovino?.sexo || 'Macho',
    fecha_nacimiento: bovino?.fecha_nacimiento || '',
    peso_actual: bovino?.peso_actual || '',
    valor_estimado: bovino?.valor_estimado || '',
    ubicacion_municipio: bovino?.ubicacion_municipio || '',
    descripcion: bovino?.descripcion || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        peso_actual: parseFloat(formData.peso_actual as any),
        valor_estimado: formData.valor_estimado ? parseFloat(formData.valor_estimado as any) : undefined
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {bovino ? 'Editar Bovino' : 'Registrar Nuevo Bovino'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Código Interno (opcional)"
          name="codigo_interno"
          value={formData.codigo_interno}
          onChange={handleChange}
          placeholder="Ej: BOV-001"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Raza *</label>
          <select
            name="raza"
            value={formData.raza}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Selecciona la raza</option>
            {RAZAS.map(raza => (
              <option key={raza} value={raza}>{raza}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sexo *</label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
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
          name="peso_actual"
          value={formData.peso_actual}
          onChange={handleChange}
          required
          min="0"
          max="1500"
          step="0.1"
          placeholder="450.5"
        />

        <Input
          type="number"
          label="Valor Estimado (COP)"
          name="valor_estimado"
          value={formData.valor_estimado}
          onChange={handleChange}
          min="0"
          step="1000"
          placeholder="5000000"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Municipio *</label>
          <select
            name="ubicacion_municipio"
            value={formData.ubicacion_municipio}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Selecciona el municipio</option>
            {MUNICIPIOS.map(mun => (
              <option key={mun} value={mun}>{mun}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Características adicionales del bovino..."
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" loading={loading} className="flex-1">
          {bovino ? 'Actualizar' : 'Registrar'} Bovino
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
};
