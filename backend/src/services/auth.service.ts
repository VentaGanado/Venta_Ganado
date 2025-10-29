import bcrypt from 'bcrypt';
import { UsuarioModel } from '../models/usuario.model';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../config/jwt';
import { UsuarioRegistro, UsuarioLogin, AuthResponse } from '../types/usuario.types';
import HttpError from '../utils/http-error';

const SALT_ROUNDS = 10;

export const AuthService = {
  register: async (data: UsuarioRegistro): Promise<AuthResponse> => {
    const emailExists = await UsuarioModel.emailExists(data.email);
    if (emailExists) {
      throw new HttpError(400, 'El email ya está registrado');
    }

    const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const userId = await UsuarioModel.create({
      ...data,
      password_hash
    });

    const user = await UsuarioModel.findById(userId);
    if (!user) {
      throw new HttpError(500, 'Error al crear usuario');
    }

    const payload = {
      id: user.id,
      email: user.email,
      nombre: user.nombre
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await UsuarioModel.updateRefreshToken(userId, refreshToken);

    return {
      user,
      accessToken,
      refreshToken
    };
  },

  login: async (data: UsuarioLogin): Promise<AuthResponse> => {
    const userWithPassword = await UsuarioModel.findByEmail(data.email);
    if (!userWithPassword) {
      throw new HttpError(401, 'Credenciales inválidas');
    }

    if (!userWithPassword.activo) {
      throw new HttpError(401, 'Usuario inactivo. Contacta al administrador');
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      userWithPassword.password_hash
    );

    if (!isPasswordValid) {
      throw new HttpError(401, 'Credenciales inválidas');
    }

    const user = await UsuarioModel.findById(userWithPassword.id);
    if (!user) {
      throw new HttpError(500, 'Error al obtener datos del usuario');
    }

    const payload = {
      id: user.id,
      email: user.email,
      nombre: user.nombre
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await UsuarioModel.updateRefreshToken(user.id, refreshToken);

    return {
      user,
      accessToken,
      refreshToken
    };
  },

  refresh: async (token: string): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
      const decoded = verifyRefreshToken(token) as any;

      const isValid = await UsuarioModel.verifyRefreshToken(decoded.id, token);
      if (!isValid) {
        throw new HttpError(401, 'Refresh token inválido');
      }

      const user = await UsuarioModel.findById(decoded.id);
      if (!user || !user.activo) {
        throw new HttpError(404, 'Usuario no encontrado o inactivo');
      }

      const payload = {
        id: user.id,
        email: user.email,
        nombre: user.nombre
      };

      const newAccessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      await UsuarioModel.updateRefreshToken(user.id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new HttpError(401, 'Refresh token inválido o expirado');
    }
  },

  logout: async (userId: number): Promise<void> => {
    await UsuarioModel.updateRefreshToken(userId, null);
  }
};
