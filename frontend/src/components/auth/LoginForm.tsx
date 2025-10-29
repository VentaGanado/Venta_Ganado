import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login, loading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (err) {
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      {/* Left Panel - Brand/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 flex-col items-center justify-center text-white p-16">
        <div className="text-center max-w-lg">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold">GB</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Bienvenido a GanadoBoy
          </h1>
          
          <p className="text-lg text-green-50 leading-relaxed">
            Gestiona tu ganado bovino de forma profesional. Registra, publica y controla todo desde una sola plataforma.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Iniciar Sesión</h2>
            <p className="text-gray-600 text-lg">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
                Créala ahora
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <Input
                type="email"
                name="email"
                label="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
                className="text-base"
              />
            </div>

            <div>
              <Input
                type="password"
                name="password"
                label="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="text-base"
              />
            </div>

            <div className="text-center">
              <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg shadow-sm hover:shadow-md transition-all text-lg"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
