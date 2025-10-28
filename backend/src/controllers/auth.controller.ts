import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/responses";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../utils/validators";
import logger from "../utils/logger";

export const AuthController = {
  // POST /api/auth/register
  register: async (req: Request, res: Response) => {
    try {
      const validatedData = registerSchema.parse(req.body);

      const result = await AuthService.register(validatedData);

      logger.info("Usuario registrado", {
        userId: result.user.id,
        email: result.user.email,
      });

      return sendSuccess(res, 201, result, "Usuario registrado exitosamente");
    } catch (error: any) {
      logger.error("Error en registro", { error: error.message });

      if (error.name === "ZodError") {
        return sendError(res, 400, "Validation Error", error.errors);
      }

      if (error.message === "El email ya está registrado") {
        return sendError(res, 400, error.message);
      }

      return sendError(res, 500, "Error al registrar usuario");
    }
  },

  // POST /api/auth/login
  login: async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      const result = await AuthService.login(validatedData);

      logger.info("Usuario inició sesión", {
        userId: result.user.id,
        email: result.user.email,
      });

      return sendSuccess(res, 200, result, "Login exitoso");
    } catch (error: any) {
      logger.error("Error en login", { error: error.message });

      if (error.name === "ZodError") {
        return sendError(res, 400, "Validation Error", error.errors);
      }

      if (
        error.message === "Credenciales inválidas" ||
        error.message.includes("Usuario inactivo")
      ) {
        return sendError(res, 401, error.message);
      }

      return sendError(res, 500, "Error al iniciar sesión");
    }
  },

  // POST /api/auth/refresh
  refresh: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = refreshTokenSchema.parse(req.body);

      const result = await AuthService.refresh(refreshToken);

      logger.info("Token renovado");

      return sendSuccess(res, 200, result, "Token renovado exitosamente");
    } catch (error: any) {
      logger.error("Error en refresh token", { error: error.message });

      if (error.name === "ZodError") {
        return sendError(res, 400, "Validation Error", error.errors);
      }

      return sendError(res, 401, "Refresh token inválido o expirado");
    }
  },

  // POST /api/auth/logout
  logout: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendError(res, 401, "No autorizado");
      }

      await AuthService.logout(req.user.id);

      logger.info("Usuario cerró sesión", { userId: req.user.id });

      return sendSuccess(res, 200, null, "Sesión cerrada exitosamente");
    } catch (error: any) {
      logger.error("Error en logout", { error: error.message });
      return sendError(res, 500, "Error al cerrar sesión");
    }
  },

  // GET /api/auth/me - Obtener usuario actual
  me: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendError(res, 401, "No autorizado");
      }

      const user = await UsuarioModel.findById(req.user.id);

      if (!user) {
        return sendError(res, 404, "Usuario no encontrado");
      }

      return sendSuccess(res, 200, { user }, "Usuario obtenido exitosamente");
    } catch (error: any) {
      logger.error("Error al obtener usuario actual", { error: error.message });
      return sendError(res, 500, "Error al obtener datos del usuario");
    }
  },
};

import { UsuarioModel } from "../models/usuario.model";
