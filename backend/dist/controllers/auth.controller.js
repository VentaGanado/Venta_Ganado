"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const responses_1 = require("../utils/responses");
const validators_1 = require("../utils/validators");
const logger_1 = __importDefault(require("../utils/logger"));
exports.AuthController = {
    // POST /api/auth/register
    register: async (req, res) => {
        try {
            const validatedData = validators_1.registerSchema.parse(req.body);
            const result = await auth_service_1.AuthService.register(validatedData);
            logger_1.default.info("Usuario registrado", {
                userId: result.user.id,
                email: result.user.email,
            });
            return (0, responses_1.sendSuccess)(res, 201, result, "Usuario registrado exitosamente");
        }
        catch (error) {
            logger_1.default.error("Error en registro", { error: error.message });
            if (error.name === "ZodError") {
                return (0, responses_1.sendError)(res, 400, "Validation Error", error.errors);
            }
            if (error.message === "El email ya está registrado") {
                return (0, responses_1.sendError)(res, 400, error.message);
            }
            return (0, responses_1.sendError)(res, 500, "Error al registrar usuario");
        }
    },
    // POST /api/auth/login
    login: async (req, res) => {
        try {
            const validatedData = validators_1.loginSchema.parse(req.body);
            const result = await auth_service_1.AuthService.login(validatedData);
            logger_1.default.info("Usuario inició sesión", {
                userId: result.user.id,
                email: result.user.email,
            });
            return (0, responses_1.sendSuccess)(res, 200, result, "Login exitoso");
        }
        catch (error) {
            logger_1.default.error("Error en login", { error: error.message });
            if (error.name === "ZodError") {
                return (0, responses_1.sendError)(res, 400, "Validation Error", error.errors);
            }
            if (error.message === "Credenciales inválidas" ||
                error.message.includes("Usuario inactivo")) {
                return (0, responses_1.sendError)(res, 401, error.message);
            }
            return (0, responses_1.sendError)(res, 500, "Error al iniciar sesión");
        }
    },
    // POST /api/auth/refresh
    refresh: async (req, res) => {
        try {
            const { refreshToken } = validators_1.refreshTokenSchema.parse(req.body);
            const result = await auth_service_1.AuthService.refresh(refreshToken);
            logger_1.default.info("Token renovado");
            return (0, responses_1.sendSuccess)(res, 200, result, "Token renovado exitosamente");
        }
        catch (error) {
            logger_1.default.error("Error en refresh token", { error: error.message });
            if (error.name === "ZodError") {
                return (0, responses_1.sendError)(res, 400, "Validation Error", error.errors);
            }
            return (0, responses_1.sendError)(res, 401, "Refresh token inválido o expirado");
        }
    },
    // POST /api/auth/logout
    logout: async (req, res) => {
        try {
            if (!req.user) {
                return (0, responses_1.sendError)(res, 401, "No autorizado");
            }
            await auth_service_1.AuthService.logout(req.user.id);
            logger_1.default.info("Usuario cerró sesión", { userId: req.user.id });
            return (0, responses_1.sendSuccess)(res, 200, null, "Sesión cerrada exitosamente");
        }
        catch (error) {
            logger_1.default.error("Error en logout", { error: error.message });
            return (0, responses_1.sendError)(res, 500, "Error al cerrar sesión");
        }
    },
    // GET /api/auth/me - Obtener usuario actual
    me: async (req, res) => {
        try {
            if (!req.user) {
                return (0, responses_1.sendError)(res, 401, "No autorizado");
            }
            const user = await usuario_model_1.UsuarioModel.findById(req.user.id);
            if (!user) {
                return (0, responses_1.sendError)(res, 404, "Usuario no encontrado");
            }
            return (0, responses_1.sendSuccess)(res, 200, { user }, "Usuario obtenido exitosamente");
        }
        catch (error) {
            logger_1.default.error("Error al obtener usuario actual", { error: error.message });
            return (0, responses_1.sendError)(res, 500, "Error al obtener datos del usuario");
        }
    },
};
const usuario_model_1 = require("../models/usuario.model");
