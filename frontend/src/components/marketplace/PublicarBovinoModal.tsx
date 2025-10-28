import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { Bovino } from '../../types/bovino.types';
import type { CrearPublicacionData } from '../../types/marketplace.types';

interface PublicarBovinoModalProps {
  bovino: Bovino;
  onSubmit: (data: CrearPublicacionData) => Promise<void>;
  onCancel: () => void;
}

export const PublicarBovinoModal: React.FC<PublicarBovinoModalProps> = ({
  bovino,
  onSubmit,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: `${bovino.raza} ${bovino.sexo === 'M' ? 'Macho' : 'Hembra'} - ${bovino.ubicacion_municipio || ''}`,
    descripcion: bovino.descripcion || '',
    precio: bovino.valor_estimado || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        bovino_id: bovino.id,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio: typeof formData.precio === 'string' ? parseFloat(formData.precio) : formData.precio,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Publicar Bovino en Marketplace
              </h2>
              <p className="text-sm text-gray-600">
                Completa la información para publicar tu bovino a la venta
              </p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Información del bovino */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Información del Bovino:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
              <div><strong>Raza:</strong> {bovino.raza}</div>
              <div><strong>Sexo:</strong> {bovino.sexo === 'M' ? 'Macho' : 'Hembra'}</div>
              <div><strong>Edad:</strong> {bovino.edad} años</div>
              <div><strong>Peso:</strong> {bovino.peso} kg</div>
              <div className="col-span-2"><strong>Ubicación:</strong> {bovino.ubicacion_municipio}</div>
            </div>
          </div>

          {/* Formulario */}
          <div className="space-y-4">
            <Input
              label="Título de la Publicación *"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              placeholder="Ej: Holstein Hembra 3 años - Alta producción"
              maxLength={100}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe las características destacadas del bovino, su historial, ventajas, etc."
              />
              <p className="text-xs text-gray-500 mt-1">
                Proporciona información detallada para atraer compradores
              </p>
            </div>

            <Input
              type="number"
              label="Precio de Venta (COP) *"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
              min="0"
              step="100000"
              placeholder="5000000"
            />
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Información importante:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Tu publicación será visible para todos los usuarios del marketplace</li>
              <li>• Puedes activar/desactivar la publicación en cualquier momento</li>
              <li>• Asegúrate de que la información sea precisa y actualizada</li>
              <li>• Los compradores podrán contactarte a través de la plataforma</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-6">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              Publicar en Marketplace
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
