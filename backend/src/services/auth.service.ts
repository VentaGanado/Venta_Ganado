import bcrypt from 'bcrypt';
import { UsuarioModel } from '../models/usuario.model';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} from '../config/jwt';
import { UsuarioRegistro, UsuarioLogin, AuthResponse } from '../types/usuario.types';

const SALT_ROUNDS = 10;

export const AuthService = {
  // Registrar usuario
  register: async (data: UsuarioRegistro): Promise<AuthResponse> => {
    // Verificar si email ya existe
    const emailExists = await UsuarioModel.emailExists(data.email);
    if (emailExists) {
      throw new Error('El email ya está registrado');
    }

    // Hashear contraseña
    const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Crear usuario
    const userId = await UsuarioModel.create({
      ...data,
      password_hash
    });

    // Obtener usuario creado
    const user = await UsuarioModel.findById(userId);
    if (!user) {
      throw new Error('Error al crear usuario');
    }

    // Generar tokens
    const payload = {
      id: user.id,
      email: user.email,
      nombre: user.nombre
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Guardar refresh token en BD
    await UsuarioModel.updateRefreshToken(userId, refreshToken);

    return {
      user,
      accessToken,
      refreshToken
    };
  },

  // Login
  login: async (data: UsuarioLogin): Promise<AuthResponse> => {
    // Buscar usuario por email
    const userWithPassword = await UsuarioModel.findByEmail(data.email);
    if (!userWithPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar si usuario está activo
    if (!userWithPassword.activo) {
      throw new Error('Usuario inactivo. Contacta al administrador');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      data.password,
      userWithPassword.password_hash
    );

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Obtener usuario sin contraseña
    const user = await UsuarioModel.findById(userWithPassword.id);
    if (!user) {
      throw new Error('Error al obtener datos del usuario');
    }

    // Generar tokens
    const payload = {
      id: user.id,
      email: user.email,
      nombre: user.nombre
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Guardar refresh token en BD
    await UsuarioModel.updateRefreshToken(user.id, refreshToken);

    return {
      user,
      accessToken,
      refreshToken
    };
  },

  // Refresh token
  refresh: async (token: string): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
      // Verificar refresh token
      const decoded = verifyRefreshToken(token) as any;

      // Verificar que el token exista en BD
      const isValid = await UsuarioModel.verifyRefreshToken(decoded.id, token);
      if (!isValid) {
        throw new Error('Refresh token inválido');
      }

      // Obtener usuario
      const user = await UsuarioModel.findById(decoded.id);
      if (!user || !user.activo) {
        throw new Error('Usuario no encontrado o inactivo');
      }

      // Generar nuevos tokens
      const payload = {
        id: user.id,
        email: user.email,
        nombre: user.nombre
      };

      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      // Actualizar refresh token en BD
      await UsuarioModel.updateRefreshToken(user.id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error('Refresh token inválido o expirado');
    }
  },

  // Logout
  logout: async (userId: number): Promise<void> => {
    // Invalidar refresh token
    await UsuarioModel.updateRefreshToken(userId, null);
  }
};
