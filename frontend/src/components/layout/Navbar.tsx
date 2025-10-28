import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-green-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform">
            <div className="text-4xl">🐄</div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                GanadoBoy
              </span>
              <p className="text-xs text-gray-500">Plataforma Ganadera</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-2">
              <Link 
                to="/marketplace" 
                className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <span className="text-xl">🛒</span>
                Marketplace
              </Link>
              <Link 
                to="/bovinos" 
                className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <span className="text-xl">🐮</span>
                Mis Bovinos
              </Link>
              <Link 
                to="/mis-publicaciones" 
                className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <span className="text-xl">📋</span>
                Publicaciones
              </Link>
              
              {/* User Menu */}
              <div className="relative ml-4">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {user?.nombre[0]}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">{user?.nombre}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <svg className={`w-4 h-4 text-gray-600 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
                      <Link
                        to="/perfil"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="text-xl">👤</span>
                        <span>Mi Perfil</span>
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span className="text-xl">🚪</span>
                        <span className="font-medium">Cerrar Sesión</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-6 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors rounded-lg hover:bg-green-50"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
