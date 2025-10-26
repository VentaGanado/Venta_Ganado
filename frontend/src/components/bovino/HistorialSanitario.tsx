import React, { useState } from 'react';
import type { RegistroSanitario } from '../../types/bovino.types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface HistorialSanitarioProps {
  historial: RegistroSanitario[];
  onAdd: (data: Partial<RegistroSanitario>) => Promise<void>;
}

export const HistorialSanitario: React.FC<HistorialSanitarioProps> = ({ historial, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'Vacuna' as const,
    fecha_aplicacion: '',
    producto_usado: '',
    dosis: '',
    veterinario: '',
    observaciones: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd(formData);
      setFormData({
        tipo: 'Vacuna',
        fecha_aplicacion: '',
        producto_usado: '',
        dosis: '',
        veterinario: '',
        observaciones: ''
      });
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const tipoIcon = {
    'Vacuna': '💉',
    'Desparasitación': '💊',
    'Diagnóstico': '🔬',
    'Tratamiento': '🏥'
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Historial Sanitario</h3>
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? 'Cancelar' : '+ Agregar Registro'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-green-50 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="Vacuna">Vacuna</option>
                <option value="Desparasitación">Desparasitación</option>
                <option value="Diagnóstico">Diagnóstico</option>
                <option value="Tratamiento">Tratamiento</option>
              </select>
            </div>

            <Input
              type="date"
              label="Fecha de Aplicación *"
              value={formData.fecha_aplicacion}
              onChange={(e) => setFormData({...formData, fecha_aplicacion: e.target.value})}
              required
            />

            <Input
              label="Producto Usado"
              value={formData.producto_usado}
              onChange={(e) => setFormData({...formData, producto_usado: e.target.value})}
              placeholder="Nombre del producto"
            />

            <Input
              label="Dosis"
              value={formData.dosis}
              onChange={(e) => setFormData({...formData, dosis: e.target.value})}
              placeholder="5ml, 10mg, etc."
            />

            <Input
              label="Veterinario"
              value={formData.veterinario}
              onChange={(e) => setFormData({...formData, veterinario: e.target.value})}
              placeholder="Dr. Juan Pérez"
            />
          </div>

          <Input
            label="Observaciones"
            value={formData.observaciones}
            onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
            placeholder="Notas adicionales..."
          />

          <Button type="submit" variant="primary" loading={loading} className="w-full">
            Guardar Registro
          </Button>
        </form>
      )}

      {/* Lista de registros */}
      <div className="space-y-3">
        {historial.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-3">📋</p>
            <p>No hay registros sanitarios aún</p>
          </div>
        ) : (
          historial.map((registro) => (
            <div key={registro.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{tipoIcon[registro.tipo]}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">{registro.tipo}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(registro.fecha_aplicacion).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  
                  {registro.producto_usado && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Producto:</span> {registro.producto_usado}
                    </p>
                  )}
                  
                  {registro.dosis && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Dosis:</span> {registro.dosis}
                    </p>
                  )}
                  
                  {registro.veterinario && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Veterinario:</span> {registro.veterinario}
                    </p>
                  )}
                  
                  {registro.observaciones && (
                    <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                      {registro.observaciones}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
