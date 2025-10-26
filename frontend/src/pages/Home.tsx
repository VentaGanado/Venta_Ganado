import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            GanadoBoy
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            La plataforma digital para la comercialización de ganado bovino en Boyacá
          </p>
          
          {!isAuthenticated ? (
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Comenzar ahora
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
              >
                Iniciar sesión
              </Link>
            </div>
          ) : (
            <Link
              to="/marketplace"
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors inline-block"
            >
              Ir al Marketplace
            </Link>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold mb-2">Trazabilidad Completa</h3>
            <p className="text-gray-600">
              Registra el historial sanitario y reproductivo de cada animal
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2">Negociación Directa</h3>
            <p className="text-gray-600">
              Comunícate directamente con compradores sin intermediarios
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold mb-2">Sistema de Reputación</h3>
            <p className="text-gray-600">
              Calificaciones que generan confianza entre compradores y vendedores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
