import pool from "../config/database";
import type { Bovino, CrearBovinoDTO, ActualizarBovinoDTO } from "../types/bovino.types";
import { RowDataPacket, ResultSetHeader } from "mysql2";

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
      throw new Error("Error al crear el bovino");
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
      throw new Error("Bovino no encontrado o no tienes permiso");
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
      throw new Error("No hay datos para actualizar");
    }

    valores.push(id, propietarioId);

    const query = `UPDATE bovinos SET ${campos.join(", ")} WHERE id = ? AND propietario_id = ?`;
    await pool.query(query, valores);

    const bovinoActualizado = await this.obtenerBovino(id, propietarioId);
    if (!bovinoActualizado) {
      throw new Error("Error al actualizar el bovino");
    }

    return bovinoActualizado;
  }

  static async eliminarBovino(id: number, propietarioId: number): Promise<void> {
    const bovino = await this.obtenerBovino(id, propietarioId);
    if (!bovino) {
      throw new Error("Bovino no encontrado o no tienes permiso");
    }

    const [publicaciones] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM publicaciones WHERE bovino_id = ? AND activo = 1",
      [id]
    );

    if (publicaciones.length > 0) {
      throw new Error(
        "No se puede eliminar el bovino porque tiene publicaciones activas"
      );
    }

    await pool.query("UPDATE bovinos SET activo = 0 WHERE id = ? AND propietario_id = ?", [
      id,
      propietarioId,
    ]);
  }
}
