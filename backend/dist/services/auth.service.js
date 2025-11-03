"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const usuario_model_1 = require("../models/usuario.model");
const jwt_1 = require("../config/jwt");
const http_error_1 = __importDefault(require("../utils/http-error"));
const SALT_ROUNDS = 10;
exports.AuthService = {
    register: async (data) => {
        const emailExists = await usuario_model_1.UsuarioModel.emailExists(data.email);
        if (emailExists) {
            throw new http_error_1.default(400, 'El email ya está registrado');
        }
        const password_hash = await bcrypt_1.default.hash(data.password, SALT_ROUNDS);
        const userId = await usuario_model_1.UsuarioModel.create({
            ...data,
            password_hash
        });
        const user = await usuario_model_1.UsuarioModel.findById(userId);
        if (!user) {
            throw new http_error_1.default(500, 'Error al crear usuario');
        }
        const payload = {
            id: user.id,
            email: user.email,
            nombre: user.nombre
        };
        const accessToken = (0, jwt_1.generateAccessToken)(payload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
        await usuario_model_1.UsuarioModel.updateRefreshToken(userId, refreshToken);
        return {
            user,
            accessToken,
            refreshToken
        };
    },
    login: async (data) => {
        const userWithPassword = await usuario_model_1.UsuarioModel.findByEmail(data.email);
        if (!userWithPassword) {
            throw new http_error_1.default(401, 'Credenciales inválidas');
        }
        if (!userWithPassword.activo) {
            throw new http_error_1.default(401, 'Usuario inactivo. Contacta al administrador');
        }
        const isPasswordValid = await bcrypt_1.default.compare(data.password, userWithPassword.password_hash);
        if (!isPasswordValid) {
            throw new http_error_1.default(401, 'Credenciales inválidas');
        }
        const user = await usuario_model_1.UsuarioModel.findById(userWithPassword.id);
        if (!user) {
            throw new http_error_1.default(500, 'Error al obtener datos del usuario');
        }
        const payload = {
            id: user.id,
            email: user.email,
            nombre: user.nombre
        };
        const accessToken = (0, jwt_1.generateAccessToken)(payload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
        await usuario_model_1.UsuarioModel.updateRefreshToken(user.id, refreshToken);
        return {
            user,
            accessToken,
            refreshToken
        };
    },
    refresh: async (token) => {
        try {
            const decoded = (0, jwt_1.verifyRefreshToken)(token);
            const isValid = await usuario_model_1.UsuarioModel.verifyRefreshToken(decoded.id, token);
            if (!isValid) {
                throw new http_error_1.default(401, 'Refresh token inválido');
            }
            const user = await usuario_model_1.UsuarioModel.findById(decoded.id);
            if (!user || !user.activo) {
                throw new http_error_1.default(404, 'Usuario no encontrado o inactivo');
            }
            const payload = {
                id: user.id,
                email: user.email,
                nombre: user.nombre
            };
            const newAccessToken = (0, jwt_1.generateAccessToken)(payload);
            const newRefreshToken = (0, jwt_1.generateRefreshToken)(payload);
            await usuario_model_1.UsuarioModel.updateRefreshToken(user.id, newRefreshToken);
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            };
        }
        catch (error) {
            throw new http_error_1.default(401, 'Refresh token inválido o expirado');
        }
    },
    logout: async (userId) => {
        await usuario_model_1.UsuarioModel.updateRefreshToken(userId, null);
    }
};
