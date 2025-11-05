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
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Información del bovino */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Información del Bovino
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Raza:</span>
                <span className="font-semibold text-gray-800">{bovino.raza}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Sexo:</span>
                <span className="font-semibold text-gray-800">{bovino.sexo === 'M' ? 'Macho' : 'Hembra'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Edad:</span>
                <span className="font-semibold text-gray-800">{bovino.edad} años</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Peso:</span>
                <span className="font-semibold text-gray-800">{bovino.peso} kg</span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">Ubicación:</span>
                <span className="font-semibold text-gray-800">{bovino.ubicacion_municipio}</span>
              </div>
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
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Información importante
            </h4>
            <ul className="text-sm text-blue-700 space-y-1.5">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Tu publicación será visible para todos los usuarios del marketplace
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Puedes activar/desactivar la publicación en cualquier momento
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Asegúrate de que la información sea precisa y actualizada
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Los compradores podrán contactarte a través de la plataforma
              </li>
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
