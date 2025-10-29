import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

const municipiosBoyaca = [
  'Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa',
  'Villa de Leyva', 'Moniquirá', 'Ramiriquí', 'Samacá', 'Ventaquemada'
];

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    municipio: '',
    departamento: 'Boyacá',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, loading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos una mayúscula';
    }

    if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos un número';
    }

    if (formData.telefono && !/^[0-9]{10}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      await register(dataToSend);
    } catch (err) {
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header decorativo */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white font-semibold">GB</div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Únete a GanadoBoy</h2>
            <p className="text-green-100 text-sm">Crea tu cuenta para empezar a vender</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            name="nombre"
            label="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Juan"
            error={errors.nombre}
          />

          <Input
            type="text"
            name="apellidos"
            label="Apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
            placeholder="Pérez García"
            error={errors.apellidos}
          />
        </div>

        <Input
          type="email"
          name="email"
          label="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="tu@email.com"
          error={errors.email}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="password"
            name="password"
            label="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            error={errors.password}
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="••••••••"
            error={errors.confirmPassword}
          />
        </div>

        <Input
          type="tel"
          name="telefono"
          label="Teléfono (opcional)"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="3201234567"
          error={errors.telefono}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Municipio
            </label>
            <select
              name="municipio"
              value={formData.municipio}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Selecciona tu municipio</option>
              {municipiosBoyaca.map((mun) => (
                <option key={mun} value={mun}>
                  {mun}
                </option>
              ))}
            </select>
          </div>

          <Input
            type="text"
            name="departamento"
            label="Departamento"
            value={formData.departamento}
            onChange={handleChange}
            disabled
          />
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <p className="font-semibold text-green-800 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Requisitos de contraseña:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-green-700 ml-7">
            <li>Mínimo 8 caracteres</li>
            <li>Al menos una letra mayúscula</li>
            <li>Al menos un número</li>
          </ul>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link 
            to="/login" 
            className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
};
