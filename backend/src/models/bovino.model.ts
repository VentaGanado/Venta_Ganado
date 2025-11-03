import pool from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import {
  Bovino,
  BovinoConFotos,
  Fotografia,
  RegistroSanitario,
  RegistroReproductivo,
} from "../types/bovino.types";

export const BovinoModel = {
  // Crear bovino
  create: async (bovino: any, propietario_id: number): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO bovinos (
        propietario_id, codigo_interno, raza, sexo, fecha_nacimiento, peso_actual,
        valor_estimado, ubicacion_municipio, ubicacion_departamento, coordenadas_gps, descripcion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        propietario_id,
        bovino.codigo_interno || null,
        bovino.raza,
        bovino.sexo,
        bovino.fecha_nacimiento,
        bovino.peso_actual,
        bovino.valor_estimado || null,
        bovino.ubicacion_municipio,
        bovino.ubicacion_departamento || "Boyacá",
        bovino.coordenadas_gps || null,
        bovino.descripcion || null,
      ]
    );
    return result.insertId;
  },

  // Buscar por ID con fotos
  findById: async (id: number): Promise<BovinoConFotos | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM bovinos WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return null;

    const bovino = rows[0] as Bovino;

    // Obtener fotografías
    const [fotos] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM fotografias WHERE bovino_id = ? ORDER BY es_principal DESC, orden ASC",
      [id]
    );

    const fotoPrincipal =
      fotos.find((f) => f.es_principal)?.ruta_imagen || fotos[0]?.ruta_imagen;

    return {
      ...bovino,
      fotografias: fotos as Fotografia[],
      foto_principal: fotoPrincipal,
    };
  },

  // Listar bovinos del propietario
  findByPropietario: async (
    propietario_id: number
  ): Promise<BovinoConFotos[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM bovinos WHERE propietario_id = ? ORDER BY fecha_creacion DESC",
      [propietario_id]
    );

    const bovinos = await Promise.all(
      rows.map(async (bovino) => {
        const [fotos] = await pool.query<RowDataPacket[]>(
          "SELECT * FROM fotografias WHERE bovino_id = ? ORDER BY es_principal DESC, orden ASC LIMIT 1",
          [bovino.id]
        );
        return {
          ...bovino,
          fotografias: fotos as Fotografia[],
          foto_principal: fotos[0]?.ruta_imagen,
        };
      })
    );

    return bovinos as BovinoConFotos[];
  },

  // Actualizar bovino
  update: async (id: number, bovino: any): Promise<void> => {
    const fields: string[] = [];
    const values: any[] = [];

    Object.keys(bovino).forEach((key) => {
      fields.push(`${key} = ?`);
      values.push(bovino[key]);
    });

    values.push(id);

    await pool.query(
      `UPDATE bovinos SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
  },

  // Eliminar bovino
  delete: async (id: number): Promise<void> => {
    await pool.query("DELETE FROM bovinos WHERE id = ?", [id]);
  },

  // Verificar propietario
  verifyOwner: async (
    bovino_id: number,
    propietario_id: number
  ): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM bovinos WHERE id = ? AND propietario_id = ?",
      [bovino_id, propietario_id]
    );
    return rows.length > 0;
  },

  // FOTOGRAFÍAS
  addFoto: async (
    bovino_id: number,
    ruta: string,
    es_principal: boolean,
    orden: number
  ): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO fotografias (bovino_id, ruta_imagen, es_principal, orden) VALUES (?, ?, ?, ?)",
      [bovino_id, ruta, es_principal, orden]
    );
    return result.insertId;
  },

  deleteFoto: async (id: number): Promise<void> => {
    await pool.query("DELETE FROM fotografias WHERE id = ?", [id]);
  },

  setFotoPrincipal: async (
    bovino_id: number,
    foto_id: number
  ): Promise<void> => {
    await pool.query(
      "UPDATE fotografias SET es_principal = FALSE WHERE bovino_id = ?",
      [bovino_id]
    );
    await pool.query(
      "UPDATE fotografias SET es_principal = TRUE WHERE id = ?",
      [foto_id]
    );
  },

  // HISTORIAL SANITARIO
  addRegistroSanitario: async (
    bovino_id: number,
    registro: any
  ): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO registros_sanitarios (
        bovino_id, tipo, fecha_aplicacion, producto_usado, dosis, veterinario, observaciones, documento_adjunto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bovino_id,
        registro.tipo,
        registro.fecha_aplicacion,
        registro.producto_usado || null,
        registro.dosis || null,
        registro.veterinario || null,
        registro.observaciones || null,
        registro.documento_adjunto || null,
      ]
    );
    return result.insertId;
  },

  getHistorialSanitario: async (
    bovino_id: number
  ): Promise<RegistroSanitario[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM registros_sanitarios WHERE bovino_id = ? ORDER BY fecha_aplicacion DESC",
      [bovino_id]
    );
    return rows as RegistroSanitario[];
  },

  // HISTORIAL REPRODUCTIVO
  addRegistroReproductivo: async (
    bovino_id: number,
    registro: any
  ): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO registros_reproductivos (bovino_id, tipo, fecha, detalles, observaciones)
       VALUES (?, ?, ?, ?, ?)`,
      [
        bovino_id,
        registro.tipo,
        registro.fecha,
        registro.detalles || null,
        registro.observaciones || null,
      ]
    );
    return result.insertId;
  },

  getHistorialReproductivo: async (
    bovino_id: number
  ): Promise<RegistroReproductivo[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM registros_reproductivos WHERE bovino_id = ? ORDER BY fecha DESC",
      [bovino_id]
    );
    return rows as RegistroReproductivo[];
  },
};
