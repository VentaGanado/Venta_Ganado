import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/layout/Navbar';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-0 w-full px-6 sm:px-8 md:px-12 lg:px-20 py-24 md:py-28 flex flex-col justify-center items-center text-center">

        <div className="max-w-5xl w-full mx-auto">
          {/* Emoji Icon */}
          <div className="mb-8 animate-bounce-subtle">
            <span className="text-8xl md:text-9xl drop-shadow-lg">🐄</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent leading-tight">
            GanadoBoy
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-700 mb-6 font-semibold leading-relaxed">
            La plataforma digital para la comercialización de ganado bovino en Boyacá
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            Conectamos ganaderos y compradores de forma segura y transparente
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
                >
                  🚀 Comenzar ahora
                </Link>
                <Link
                  to="/login"
                  className="px-10 py-4 bg-white border-2 border-green-600 text-green-700 rounded-xl font-bold text-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
                >
                  🔑 Iniciar sesión
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/bovinos"
                  className="px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
                >
                  🐮 Ver Mis Bovinos
                </Link>
                <Link
                  to="/marketplace"
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
                >
                  🛒 Explorar Marketplace
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section - CORREGIDO */}
      <section className="relative z-10 w-full flex justify-center bg-white py-16 md:py-20">
        <div className="max-w-5xl w-full px-6 sm:px-8 md:px-12 lg:px-20 text-center">

          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-16 md:mb-20">
            ¿Por qué elegir GanadoBoy?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                icon: '📋',
                title: 'Trazabilidad Completa',
                text: 'Registra el historial sanitario, reproductivo y genealógico de cada animal. Mantén toda la información organizada en un solo lugar.',
                color: 'green',
              },
              {
                icon: '🤝',
                title: 'Negociación Directa',
                text: 'Comunícate directamente con compradores sin intermediarios. Ahorra tiempo y costos en tus transacciones comerciales.',
                color: 'blue',
              },
              {
                icon: '⭐',
                title: 'Sistema de Reputación',
                text: 'Calificaciones y comentarios que generan confianza entre compradores y vendedores. Construye tu reputación en el mercado.',
                color: 'yellow',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 ${
                  feature.color === 'green' ? 'border-green-500' : 
                  feature.color === 'blue' ? 'border-blue-500' : 'border-yellow-500'
                } transform hover:-translate-y-2 p-6 md:p-8`}
              >
                <div className="text-5xl md:text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full flex justify-center bg-white py-16 md:py-20">
        <div className="max-w-5xl w-full px-6 sm:px-8 md:px-12 lg:px-20 text-center">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-10 md:p-16 text-center text-white">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 md:mb-12">Nuestra Comunidad</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                <div className="bg-white/10 rounded-xl p-6 md:p-8 backdrop-blur-sm">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2">500+</div>
                  <p className="text-lg md:text-xl font-semibold">Ganaderos Registrados</p>
                </div>
                <div className="bg-white/10 rounded-xl p-6 md:p-8 backdrop-blur-sm">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2">2,000+</div>
                  <p className="text-lg md:text-xl font-semibold">Bovinos Registrados</p>
                </div>
                <div className="bg-white/10 rounded-xl p-6 md:p-8 backdrop-blur-sm">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2">10+</div>
                  <p className="text-lg md:text-xl font-semibold">Municipios de Boyacá</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      {!isAuthenticated && (
        <section className="w-full px-6 sm:px-10 md:px-16 lg:px-24 py-16 md:py-20">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 text-center p-10 md:p-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
              ¿Listo para comenzar?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Únete a la comunidad ganadera más grande de Boyacá
            </p>
            <Link
              to="/register"
              className="inline-block px-10 md:px-12 py-3 md:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
            >
              Crear cuenta gratuita
            </Link>
          </div>
        </section>
      )}

      {/* Footer Spacer */}
      <div className="h-16"></div>
    </div>
  );
};