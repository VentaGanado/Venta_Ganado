import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/layout/Navbar';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="w-full px-6 lg:px-16 xl:px-24 2xl:px-32 py-8 md:py-12">
        <div className="text-center max-w-7xl mx-auto">
          {/* Emoji Icon */}
          <div className="mb-3">
            <span className="text-5xl md:text-6xl inline-block">🐄</span>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-3 bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent leading-tight">
            GanadoBoy
          </h1>
          
          {/* Subtitle */}
          <p className="text-base md:text-xl lg:text-2xl text-gray-700 mb-2 font-semibold px-4">
            La plataforma digital para la comercialización de ganado bovino en Boyacá
          </p>
          
          {/* Description */}
          <p className="text-sm md:text-base text-gray-600 mb-6 max-w-3xl mx-auto">
            Conectamos ganaderos y compradores de forma segura y transparente
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200 text-center"
                >
                  🚀 Comenzar ahora
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-6 py-2.5 bg-white border-2 border-green-600 text-green-700 rounded-lg font-semibold text-sm hover:bg-green-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200 text-center"
                >
                  🔑 Iniciar sesión
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/bovinos"
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200 text-center"
                >
                  🐮 Ver Mis Bovinos
                </Link>
                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200 text-center"
                >
                  🛒 Explorar Marketplace
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-6 lg:px-16 xl:px-24 2xl:px-32 py-8 md:py-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-6 text-gray-800">
            ¿Por qué elegir GanadoBoy?
          </h2>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-green-500">
              <div className="p-5">
                <div className="text-4xl mb-2 text-center">📋</div>
                <h3 className="text-base font-bold mb-2 text-gray-800 text-center">
                  Trazabilidad Completa
                </h3>
                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  Registra el historial sanitario, reproductivo y genealógico de cada animal. Mantén toda la información organizada en un solo lugar.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-blue-500">
              <div className="p-5">
                <div className="text-4xl mb-2 text-center">🤝</div>
                <h3 className="text-base font-bold mb-2 text-gray-800 text-center">
                  Negociación Directa
                </h3>
                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  Comunícate directamente con compradores sin intermediarios. Ahorra tiempo y costos en tus transacciones comerciales.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-yellow-500">
              <div className="p-5">
                <div className="text-4xl mb-2 text-center">⭐</div>
                <h3 className="text-base font-bold mb-2 text-gray-800 text-center">
                  Sistema de Reputación
                </h3>
                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  Calificaciones y comentarios que generan confianza entre compradores y vendedores. Construye tu reputación en el mercado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full px-6 lg:px-16 xl:px-24 2xl:px-32 py-8 md:py-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-xl">
            <div className="p-6 md:p-8">
              {/* Section Title */}
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-5 text-white">
                Nuestra Comunidad
              </h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-1 text-white">500+</div>
                  <p className="text-xs md:text-sm lg:text-base text-green-100 font-medium">Ganaderos Registrados</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-1 text-white">2,000+</div>
                  <p className="text-xs md:text-sm lg:text-base text-green-100 font-medium">Bovinos Registrados</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-1 text-white">10+</div>
                  <p className="text-xs md:text-sm lg:text-base text-green-100 font-medium">Municipios de Boyacá</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      {!isAuthenticated && (
        <section className="w-full px-6 lg:px-16 xl:px-24 2xl:px-32 py-8 md:py-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 md:p-8 text-center">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-gray-800">
                  ¿Listo para comenzar?
                </h2>
                
                <p className="text-sm md:text-base text-gray-600 mb-4 max-w-2xl mx-auto">
                  Únete a la comunidad ganadera más grande de Boyacá
                </p>
                
                <Link
                  to="/register"
                  className="inline-block px-8 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold text-sm md:text-base hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
                >
                  Crear cuenta gratuita
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer Spacer */}
      <div className="h-8"></div>
    </div>
  );
};