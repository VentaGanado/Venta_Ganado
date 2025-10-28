import pool from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Usuario, UsuarioRegistro } from "../types/usuario.types";

export const UsuarioModel = {
  create: async (
    usuario: UsuarioRegistro & { password_hash: string }
  ): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO usuarios (nombre, apellidos, email, password_hash, telefono, municipio, departamento)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        usuario.nombre,
        usuario.apellidos,
        usuario.email,
        usuario.password_hash,
        usuario.telefono || null,
        usuario.municipio,
        usuario.departamento || "Boyacá",
      ]
    );
    return result.insertId;
  },

  findByEmail: async (email: string): Promise<any | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  findById: async (id: number): Promise<Usuario | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, nombre, apellidos, email, telefono, municipio, departamento, foto_perfil, fecha_registro, activo FROM usuarios WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? (rows[0] as Usuario) : null;
  },

  updateRefreshToken: async (
    userId: number,
    refreshToken: string | null
  ): Promise<void> => {
    await pool.query("UPDATE usuarios SET refresh_token = ? WHERE id = ?", [
      refreshToken,
      userId,
    ]);
  },

  verifyRefreshToken: async (
    userId: number,
    refreshToken: string
  ): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM usuarios WHERE id = ? AND refresh_token = ?",
      [userId, refreshToken]
    );
    return rows.length > 0;
  },

  emailExists: async (email: string): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );
    return rows.length > 0;
  },
};
