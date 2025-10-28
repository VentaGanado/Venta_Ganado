import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/layout/Navbar'; // ← 

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Navbar /> 
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="text-8xl mb-6 animate-bounce-slow">🐄</div>
          <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent">
            GanadoBoy
          </h1>
          <p className="text-2xl text-gray-700 mb-4 font-medium">
            La plataforma digital para la comercialización de ganado bovino en Boyacá
          </p>
          <p className="text-lg text-gray-600 mb-10">
            Conectamos ganaderos y compradores de forma segura y transparente
          </p>
          
          {!isAuthenticated ? (
            <div className="flex gap-6 justify-center flex-wrap">
              <Link
                to="/register"
                className="px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 duration-200"
              >
                🚀 Comenzar ahora
              </Link>
              <Link
                to="/login"
                className="px-10 py-4 border-3 border-green-600 text-green-700 rounded-xl font-bold text-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
              >
                🔑 Iniciar sesión
              </Link>
            </div>
          ) : (
            <div className="flex gap-6 justify-center flex-wrap">
              <Link
                to="/bovinos"
                className="px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 duration-200 inline-flex items-center gap-2"
              >
                🐮 Ver Mis Bovinos
              </Link>
              <Link
                to="/marketplace"
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 duration-200 inline-flex items-center gap-2"
              >
                🛒 Explorar Marketplace
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            ¿Por qué elegir GanadoBoy?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300 border-t-4 border-green-500">
              <div className="text-6xl mb-6 text-center">📋</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">Trazabilidad Completa</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Registra el historial sanitario, reproductivo y genealógico de cada animal. Mantén toda la información organizada en un solo lugar.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300 border-t-4 border-blue-500">
              <div className="text-6xl mb-6 text-center">🤝</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">Negociación Directa</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Comunícate directamente con compradores sin intermediarios. Ahorra tiempo y costos en tus transacciones comerciales.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300 border-t-4 border-yellow-500">
              <div className="text-6xl mb-6 text-center">⭐</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">Sistema de Reputación</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Calificaciones y comentarios que generan confianza entre compradores y vendedores. Construye tu reputación en el mercado.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-12 text-white shadow-2xl">
          <h2 className="text-4xl font-bold text-center mb-12">Nuestra Comunidad</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-2">500+</div>
              <p className="text-xl text-green-100">Ganaderos Registrados</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-2">2,000+</div>
              <p className="text-xl text-green-100">Bovinos Registrados</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-2">10+</div>
              <p className="text-xl text-green-100">Municipios de Boyacá</p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        {!isAuthenticated && (
          <div className="mt-20 text-center bg-white rounded-3xl p-12 shadow-xl">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Únete a la comunidad ganadera más grande de Boyacá
            </p>
            <Link
              to="/register"
              className="px-12 py-5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-xl hover:from-green-700 hover:to-green-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 duration-200 inline-block"
            >
              Crear cuenta gratuita
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};