import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth.api';
import type { RegistroData, LoginData } from '../types/auth.types';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { setAuth, logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();

  const register = async (data: RegistroData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authApi.register(data);
      setAuth(result.user, result.accessToken, result.refreshToken);
      
      // Redirigir a la página principal después del registro
      navigate('/');
      return result;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al registrarse';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authApi.login(data);
      setAuth(result.user, result.accessToken, result.refreshToken);
      
      // Redirigir a la página principal después del login
      navigate('/');
      return result;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authApi.logout();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      logoutStore();
      navigate('/login');
      setLoading(false);
    }
  };

  return {
    register,
    login,
    logout,
    loading,
    error,
    setError,
  };
};
