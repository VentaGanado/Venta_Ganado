import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-gradient-to-r from-white via-green-50/30 to-white backdrop-blur-sm shadow-lg border-b-2 border-green-100 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-16 xl:px-24 2xl:px-32">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo con animación */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-11 h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                🐄
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-baseline gap-2">
                <span className="text-lg lg:text-xl font-extrabold bg-gradient-to-r from-green-700 via-green-600 to-green-700 bg-clip-text text-transparent">GanadoBoy</span>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Beta</span>
              </div>
              <p className="text-[10px] lg:text-xs text-gray-600 font-medium leading-tight">Tu marketplace ganadero</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <Link 
                to="/marketplace" 
                className="relative px-4 lg:px-5 py-2 text-sm lg:text-base text-gray-700 font-semibold rounded-xl hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-200 group"
              >
                <span className="flex items-center gap-2">
                  🛒
                  <span>Marketplace</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-green-400 group-hover:w-full transition-all duration-300"></div>
              </Link>
              
              <Link 
                to="/bovinos" 
                className="relative px-4 lg:px-5 py-2 text-sm lg:text-base text-gray-700 font-semibold rounded-xl hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-200 group"
              >
                <span className="flex items-center gap-2">
                  🐮
                  <span>Mis Bovinos</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-green-400 group-hover:w-full transition-all duration-300"></div>
              </Link>
              
              <Link 
                to="/mis-publicaciones" 
                className="relative px-4 lg:px-5 py-2 text-sm lg:text-base text-gray-700 font-semibold rounded-xl hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-200 group"
              >
                <span className="flex items-center gap-2">
                  📢
                  <span>Publicaciones</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-green-400 group-hover:w-full transition-all duration-300"></div>
              </Link>
              
              {/* User Menu */}
              <div className="relative ml-4 lg:ml-6">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center space-x-3 bg-gradient-to-br from-white to-green-50 hover:from-green-50 hover:to-green-100 px-4 lg:px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-xl border border-green-100 hover:border-green-200"
                >
                  <div className="relative">
                    <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white">
                      {user?.nombre[0]}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-sm font-bold text-gray-800 leading-tight">{user?.nombre}</p>
                    <p className="text-[10px] text-gray-500 truncate max-w-[140px] leading-tight">{user?.email}</p>
                  </div>
                  <svg className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl py-2 z-50 border-2 border-green-100 overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-green-500 to-green-600"></div>
                      <Link
                        to="/perfil"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="text-xl">👤</span>
                        <span className="font-medium">Mi Perfil</span>
                      </Link>
                      <hr className="my-2 border-green-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all font-medium"
                      >
                        <span className="text-xl">🚪</span>
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link
                to="/login"
                className="px-4 lg:px-6 py-2 lg:py-2.5 text-sm lg:text-base text-gray-700 hover:text-green-600 font-semibold transition-all rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="relative px-5 lg:px-7 py-2 lg:py-2.5 text-sm lg:text-base font-bold text-white rounded-xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-700 to-green-600 group-hover:from-green-700 group-hover:via-green-800 group-hover:to-green-700 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative flex items-center gap-2">
                  <span>✨</span>
                  <span>Registrarse</span>
                </span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-green-100 bg-gradient-to-br from-white to-green-50/30 rounded-b-2xl">
            <div className="space-y-2 px-2">
              <Link
                to="/marketplace"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 rounded-xl font-semibold transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl">🛒</span>
                <span>Marketplace</span>
              </Link>
              <Link
                to="/bovinos"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 rounded-xl font-semibold transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl">🐮</span>
                <span>Mis Bovinos</span>
              </Link>
              <Link
                to="/mis-publicaciones"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 rounded-xl font-semibold transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl">📢</span>
                <span>Mis Publicaciones</span>
              </Link>
              <hr className="my-2 border-green-200" />
              <Link
                to="/perfil"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 rounded-xl font-semibold transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl">👤</span>
                <span>Mi Perfil</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-all"
              >
                <span className="text-xl">🚪</span>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};