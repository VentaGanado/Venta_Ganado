import pool from "../config/database";
import type { 
  Bovino, 
  CrearBovinoDTO, 
  ActualizarBovinoDTO,
  BovinoFoto,
  RegistroSanitario,
  CrearRegistroSanitarioDTO,
  RegistroReproductivo,
  CrearRegistroReproductivoDTO
} from "../types/bovino.types";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import HttpError from "../utils/http-error";

export class BovinoService {
  static async obtenerBovinos(propietarioId: number): Promise<Bovino[]> {
    const query = `
      SELECT * FROM bovinos 
      WHERE propietario_id = ? AND activo = 1
      ORDER BY registro_fecha DESC
    `;
    
    const [rows] = await pool.query<RowDataPacket[]>(query, [propietarioId]);
    return rows as Bovino[];
  }

  static async obtenerBovino(id: number, propietarioId: number): Promise<Bovino | null> {
    const query = `
      SELECT * FROM bovinos 
      WHERE id = ? AND propietario_id = ?
    `;
    
    const [rows] = await pool.query<RowDataPacket[]>(query, [id, propietarioId]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as Bovino;
  }

  static async crearBovino(propietarioId: number, datos: CrearBovinoDTO): Promise<Bovino> {
    const query = `
      INSERT INTO bovinos (
        propietario_id, nombre, raza, sexo, edad, peso,
        ubicacion_municipio, ubicacion_departamento, 
        estado_sanitario, descripcion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query<ResultSetHeader>(query, [
      propietarioId,
      datos.nombre || null,
      datos.raza,
      datos.sexo,
      datos.edad || null,
      datos.peso || null,
      datos.ubicacion_municipio || null,
      datos.ubicacion_departamento || 'Boyacá',
      datos.estado_sanitario || null,
      datos.descripcion || null,
    ]);

    const bovino = await this.obtenerBovino(result.insertId, propietarioId);
    if (!bovino) {
      throw new HttpError(500, "Error al crear el bovino");
    }
    
    return bovino;
  }

  static async actualizarBovino(
    id: number,
    propietarioId: number,
    datos: ActualizarBovinoDTO
  ): Promise<Bovino> {
    const bovino = await this.obtenerBovino(id, propietarioId);
    if (!bovino) {
      throw new HttpError(404, "Bovino no encontrado o no tienes permiso");
    }

    const campos: string[] = [];
    const valores: any[] = [];

    if (datos.nombre !== undefined) {
      campos.push("nombre = ?");
      valores.push(datos.nombre);
    }

    if (datos.raza !== undefined) {
      campos.push("raza = ?");
      valores.push(datos.raza);
    }

    if (datos.sexo !== undefined) {
      campos.push("sexo = ?");
      valores.push(datos.sexo);
    }

    if (datos.edad !== undefined) {
      campos.push("edad = ?");
      valores.push(datos.edad);
    }

    if (datos.peso !== undefined) {
      campos.push("peso = ?");
      valores.push(datos.peso);
    }

    if (datos.ubicacion_municipio !== undefined) {
      campos.push("ubicacion_municipio = ?");
      valores.push(datos.ubicacion_municipio);
    }

    if (datos.ubicacion_departamento !== undefined) {
      campos.push("ubicacion_departamento = ?");
      valores.push(datos.ubicacion_departamento);
    }

    if (datos.estado_sanitario !== undefined) {
      campos.push("estado_sanitario = ?");
      valores.push(datos.estado_sanitario);
    }

    if (datos.foto_principal !== undefined) {
      campos.push("foto_principal = ?");
      valores.push(datos.foto_principal);
    }

    if (datos.descripcion !== undefined) {
      campos.push("descripcion = ?");
      valores.push(datos.descripcion);
    }

    if (datos.activo !== undefined) {
      campos.push("activo = ?");
      valores.push(datos.activo);
    }

    if (campos.length === 0) {
      throw new HttpError(400, "No hay datos para actualizar");
    }

    valores.push(id, propietarioId);

    const query = `UPDATE bovinos SET ${campos.join(", ")} WHERE id = ? AND propietario_id = ?`;
    await pool.query(query, valores);

    const bovinoActualizado = await this.obtenerBovino(id, propietarioId);
    if (!bovinoActualizado) {
      throw new HttpError(500, "Error al actualizar el bovino");
    }

    return bovinoActualizado;
  }

  static async eliminarBovino(id: number, propietarioId: number): Promise<void> {
    const bovino = await this.obtenerBovino(id, propietarioId);
    if (!bovino) {
      throw new HttpError(404, "Bovino no encontrado o no tienes permiso");
    }

    const [publicaciones] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM publicaciones WHERE bovino_id = ? AND activo = 1",
      [id]
    );

    if (publicaciones.length > 0) {
      throw new HttpError(400, "No se puede eliminar el bovino porque tiene publicaciones activas");
    }

    await pool.query("UPDATE bovinos SET activo = 0 WHERE id = ? AND propietario_id = ?", [
      id,
      propietarioId,
    ]);
  }

  // ==================== MÉTODOS PARA FOTOS ====================
  static async guardarFotos(bovinoId: number, propietarioId: number, rutasFotos: string[]): Promise<BovinoFoto[]> {
    // Verificar que el bovino pertenece al usuario
    const bovino = await this.obtenerBovino(bovinoId, propietarioId);
    if (!bovino) {
      throw new HttpError(404, "Bovino no encontrado o no tienes permiso");
    }

    const fotosGuardadas: BovinoFoto[] = [];

    for (const ruta of rutasFotos) {
      const query = `
        INSERT INTO bovino_fotos (bovino_id, ruta_foto) 
        VALUES (?, ?)
      `;
      
      const [result] = await pool.query<ResultSetHeader>(query, [bovinoId, ruta]);
      
      fotosGuardadas.push({
        id: result.insertId,
        bovino_id: bovinoId,
        ruta_foto: ruta,
        es_principal: false,
        fecha_subida: new Date()
      });
    }

    // Si es la primera foto, establecerla como principal
    if (fotosGuardadas.length > 0 && !bovino.foto_principal) {
      const primeraFoto = fotosGuardadas[0].ruta_foto;
      await pool.query(
        "UPDATE bovinos SET foto_principal = ? WHERE id = ?",
        [primeraFoto, bovinoId]
      );
      await pool.query(
        "UPDATE bovino_fotos SET es_principal = 1 WHERE id = ?",
        [fotosGuardadas[0].id]
      );
      fotosGuardadas[0].es_principal = true;
    }

    return fotosGuardadas;
  }

  // Guardar una sola foto y marcarla como principal (reemplaza la principal anterior)
  static async guardarFotoPrincipal(bovinoId: number, propietarioId: number, rutaFoto: string): Promise<BovinoFoto> {
    // Verificar que el bovino pertenece al usuario
    const bovino = await this.obtenerBovino(bovinoId, propietarioId);
    if (!bovino) {
      throw new Error("Bovino no encontrado o no tienes permiso");
    }

    // Insertar nueva foto
    const insertQuery = `INSERT INTO bovino_fotos (bovino_id, ruta_foto) VALUES (?, ?)`;
    const [result] = await pool.query<ResultSetHeader>(insertQuery, [bovinoId, rutaFoto]);
    const newFotoId = result.insertId;

    // Desmarcar foto principal anterior (si existe)
    await pool.query(`UPDATE bovino_fotos SET es_principal = 0 WHERE bovino_id = ? AND es_principal = 1`, [bovinoId]);

    // Establecer esta como foto principal en la tabla de fotos y en bovinos
    await pool.query(`UPDATE bovino_fotos SET es_principal = 1 WHERE id = ?`, [newFotoId]);
    await pool.query(`UPDATE bovinos SET foto_principal = ? WHERE id = ?`, [rutaFoto, bovinoId]);

    // Devolver objeto representando la foto
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM bovino_fotos WHERE id = ?`, [newFotoId]);
    return rows[0] as BovinoFoto;
  }

  static async obtenerFotos(bovinoId: number): Promise<BovinoFoto[]> {
    const query = `
      SELECT * FROM bovino_fotos 
      WHERE bovino_id = ?
      ORDER BY es_principal DESC, fecha_subida DESC
    `;
    
    const [rows] = await pool.query<RowDataPacket[]>(query, [bovinoId]);
    return rows as BovinoFoto[];
  }

  // ==================== MÉTODOS PARA HISTORIAL SANITARIO ====================
  static async agregarRegistroSanitario(
    bovinoId: number, 
    propietarioId: number, 
    datos: CrearRegistroSanitarioDTO
  ): Promise<RegistroSanitario> {
    // Verificar que el bovino pertenece al usuario
    const bovino = await this.obtenerBovino(bovinoId, propietarioId);
    if (!bovino) {
      throw new Error("Bovino no encontrado o no tienes permiso");
    }

    const query = `
      INSERT INTO historial_sanitario 
      (bovino_id, fecha, tipo_registro, descripcion, veterinario, costo)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query<ResultSetHeader>(query, [
      bovinoId,
      datos.fecha,
      datos.tipo_registro,
      datos.descripcion || null,
      datos.veterinario || null,
      datos.costo || null
    ]);

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM historial_sanitario WHERE id = ?",
      [result.insertId]
    );

    return rows[0] as RegistroSanitario;
  }

  static async obtenerHistorialSanitario(bovinoId: number, propietarioId: number): Promise<RegistroSanitario[]> {
    // Verificar que el bovino pertenece al usuario
    const bovino = await this.obtenerBovino(bovinoId, propietarioId);
    if (!bovino) {
      throw new Error("Bovino no encontrado o no tienes permiso");
    }

    const query = `
      SELECT * FROM historial_sanitario 
      WHERE bovino_id = ?
      ORDER BY fecha DESC
    `;
    
    const [rows] = await pool.query<RowDataPacket[]>(query, [bovinoId]);
    return rows as RegistroSanitario[];
  }

  // ==================== MÉTODOS PARA HISTORIAL REPRODUCTIVO ====================
  static async agregarRegistroReproductivo(
    bovinoId: number, 
    propietarioId: number, 
    datos: CrearRegistroReproductivoDTO
  ): Promise<RegistroReproductivo> {
    // Verificar que el bovino pertenece al usuario
    const bovino = await this.obtenerBovino(bovinoId, propietarioId);
    if (!bovino) {
      throw new Error("Bovino no encontrado o no tienes permiso");
    }

    const query = `
      INSERT INTO historial_reproductivo 
      (bovino_id, fecha, tipo_evento, descripcion, resultado, observaciones)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query<ResultSetHeader>(query, [
      bovinoId,
      datos.fecha,
      datos.tipo_evento,
      datos.descripcion || null,
      datos.resultado || null,
      datos.observaciones || null
    ]);

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM historial_reproductivo WHERE id = ?",
      [result.insertId]
    );

    return rows[0] as RegistroReproductivo;
  }

  static async obtenerHistorialReproductivo(bovinoId: number, propietarioId: number): Promise<RegistroReproductivo[]> {
    // Verificar que el bovino pertenece al usuario
    const bovino = await this.obtenerBovino(bovinoId, propietarioId);
    if (!bovino) {
      throw new Error("Bovino no encontrado o no tienes permiso");
    }

    const query = `
      SELECT * FROM historial_reproductivo 
      WHERE bovino_id = ?
      ORDER BY fecha DESC
    `;
    
    const [rows] = await pool.query<RowDataPacket[]>(query, [bovinoId]);
    return rows as RegistroReproductivo[];
  }
}
