import axiosInstance from './axios.config';
import type { RegistroData, LoginData, AuthResponse, Usuario } from '../types/auth.types';

export const authApi = {
  // Registro
  register: async (data: RegistroData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data.data;
  },

  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data.data;
  },

  // Obtener usuario actual
  me: async (): Promise<Usuario> => {
    const response = await axiosInstance.get('/auth/me');
    return response.data.data.user;
  },

  // Logout
  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  // Refresh token
  refresh: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await axiosInstance.post('/auth/refresh', { refreshToken });
    return response.data.data;
  },
};