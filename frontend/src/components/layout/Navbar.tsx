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
    <nav className="bg-white shadow-md border-b border-green-200 sticky top-0 z-50">
      <div className="w-full px-6 lg:px-16 xl:px-24 2xl:px-32">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-green-600 rounded-md flex items-center justify-center text-white font-bold text-sm shadow-sm">GB</div>
            <div>
              <span className="text-sm md:text-base font-bold text-gray-900">GanadoBoy</span>
              <p className="text-[10px] text-gray-500 hidden sm:block leading-tight">Plataforma ganadera</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link to="/marketplace" className="px-4 py-2 text-sm lg:text-base text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md font-medium transition-all">Marketplace</Link>
              <Link to="/bovinos" className="px-4 py-2 text-sm lg:text-base text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md font-medium transition-all">Mis Bovinos</Link>
              <Link to="/mis-publicaciones" className="px-4 py-2 text-sm lg:text-base text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md font-medium transition-all">Publicaciones</Link>
              
              {/* User Menu */}
              <div className="relative ml-6 lg:ml-8">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 px-4 lg:px-5 py-2 rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  <div className="w-7 h-7 lg:w-8 lg:h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm">{user?.nombre[0]}</div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-medium text-gray-800 leading-tight">{user?.nombre}</p>
                    <p className="text-[10px] text-gray-500 truncate max-w-[120px] leading-tight">{user?.email}</p>
                  </div>
                  <svg className={`w-3.5 h-3.5 text-gray-600 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100">
                      <Link
                        to="/perfil"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="text-lg">👤</span>
                        <span>Mi Perfil</span>
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span className="text-lg">🚪</span>
                        <span className="font-medium">Cerrar Sesión</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-5 lg:px-6 py-2 text-sm lg:text-base text-gray-700 hover:text-green-600 font-medium transition-colors rounded-md hover:bg-green-50"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="px-5 lg:px-6 py-2 text-sm lg:text-base bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-sm hover:shadow-md"
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
