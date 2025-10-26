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
    // Limpiar error del campo
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
      // Error manejado en el hook
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
          <p className="font-medium mb-1">Requisitos de contraseña:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Mínimo 8 caracteres</li>
            <li>Al menos una letra mayúscula</li>
            <li>Al menos un número</li>
          </ul>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full"
        >
          Registrarse
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
};
