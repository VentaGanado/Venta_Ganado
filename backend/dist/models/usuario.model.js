"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioModel = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.UsuarioModel = {
    create: async (usuario) => {
        const [result] = await database_1.default.query(`INSERT INTO usuarios (nombre, apellidos, email, password_hash, telefono, municipio, departamento)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            usuario.nombre,
            usuario.apellidos,
            usuario.email,
            usuario.password_hash,
            usuario.telefono || null,
            usuario.municipio,
            usuario.departamento || "Boyacá",
        ]);
        return result.insertId;
    },
    findByEmail: async (email) => {
        const [rows] = await database_1.default.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        return rows.length > 0 ? rows[0] : null;
    },
    findById: async (id) => {
        const [rows] = await database_1.default.query("SELECT id, nombre, apellidos, email, telefono, municipio, departamento, foto_perfil, fecha_registro, activo FROM usuarios WHERE id = ?", [id]);
        return rows.length > 0 ? rows[0] : null;
    },
    updateRefreshToken: async (userId, refreshToken) => {
        await database_1.default.query("UPDATE usuarios SET refresh_token = ? WHERE id = ?", [
            refreshToken,
            userId,
        ]);
    },
    verifyRefreshToken: async (userId, refreshToken) => {
        const [rows] = await database_1.default.query("SELECT id FROM usuarios WHERE id = ? AND refresh_token = ?", [userId, refreshToken]);
        return rows.length > 0;
    },
    emailExists: async (email) => {
        const [rows] = await database_1.default.query("SELECT id FROM usuarios WHERE email = ?", [email]);
        return rows.length > 0;
    },
};
