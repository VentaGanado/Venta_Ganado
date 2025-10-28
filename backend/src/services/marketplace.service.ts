import pool from "../config/database";
import type {
  Publicacion,
  CrearPublicacionDTO,
  ActualizarPublicacionDTO,
  FiltrosPublicacion,
} from "../types/publicacion.types";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class MarketplaceService {
  static async obtenerPublicaciones(filtros: FiltrosPublicacion) {
    const {
      raza,
      sexo,
      edadMin,
      edadMax,
      pesoMin,
      pesoMax,
      precioMin,
      precioMax,
      municipio,
      departamento,
      vacunasAlDia,
      busqueda,
      ordenarPor = "fecha_creacion",
      direccion = "desc",
      pagina = 1,
      porPagina = 12,
    } = filtros;

    let query = `
      SELECT 
        p.*,
        b.nombre as bovino_nombre,
        b.raza as bovino_raza,
        b.sexo as bovino_sexo,
        b.edad as bovino_edad,
        b.peso as bovino_peso,
        b.descripcion as bovino_descripcion,
        b.foto_principal as bovino_foto_principal,
        b.ubicacion_municipio as bovino_ubicacion_municipio,
        b.ubicacion_departamento as bovino_ubicacion_departamento,
        b.estado_sanitario as bovino_estado_sanitario,
        u.id as vendedor_id,
        u.nombre as vendedor_nombre,
        u.apellidos as vendedor_apellidos,
        u.email as vendedor_email,
        u.telefono as vendedor_telefono,
        u.municipio as vendedor_municipio,
        u.departamento as vendedor_departamento,
        u.foto_perfil as vendedor_foto_perfil
      FROM publicaciones p
      INNER JOIN bovinos b ON p.bovino_id = b.id
      INNER JOIN usuarios u ON p.vendedor_id = u.id
      WHERE p.activo = 1
    `;

    const params: any[] = [];

    if (raza) {
      query += " AND b.raza = ?";
      params.push(raza);
    }

    if (sexo) {
      query += " AND b.sexo = ?";
      params.push(sexo);
    }

    if (edadMin !== undefined) {
      query += " AND b.edad >= ?";
      params.push(edadMin);
    }

    if (edadMax !== undefined) {
      query += " AND b.edad <= ?";
      params.push(edadMax);
    }

    if (pesoMin !== undefined) {
      query += " AND b.peso >= ?";
      params.push(pesoMin);
    }

    if (pesoMax !== undefined) {
      query += " AND b.peso <= ?";
      params.push(pesoMax);
    }

    if (precioMin !== undefined) {
      query += " AND p.precio >= ?";
      params.push(precioMin);
    }

    if (precioMax !== undefined) {
      query += " AND p.precio <= ?";
      params.push(precioMax);
    }

    if (municipio) {
      query += " AND b.ubicacion_municipio = ?";
      params.push(municipio);
    }

    if (departamento) {
      query += " AND b.ubicacion_departamento = ?";
      params.push(departamento);
    }

    if (vacunasAlDia) {
      query += " AND b.estado_sanitario LIKE '%vacunas al día%'";
    }

    if (busqueda) {
      query += ` AND (
        p.titulo LIKE ? OR 
        p.descripcion LIKE ? OR 
        b.raza LIKE ? OR
        b.nombre LIKE ?
      )`;
      const searchTerm = `%${busqueda}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const countQuery = query.replace(
      /SELECT[\s\S]*?FROM/i, 
      "SELECT COUNT(DISTINCT p.id) as total FROM"
    );
    
    const [countResult] = await pool.query<RowDataPacket[]>(countQuery, params);
    const total = countResult && countResult[0] ? countResult[0].total : 0;

    const camposOrdenamiento: Record<string, string> = {
      precio: "p.precio",
      fecha_creacion: "p.fecha_creacion",
      relevancia: "p.fecha_creacion", 
    };

    const campoOrden = camposOrdenamiento[ordenarPor] || "p.fecha_creacion";
    query += ` ORDER BY ${campoOrden} ${direccion.toUpperCase()}`;

    const offset = (pagina - 1) * porPagina;
    query += " LIMIT ? OFFSET ?";
    params.push(porPagina, offset);

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    const publicaciones = rows.map((row) => ({
      id: row.id,
      vendedor_id: row.vendedor_id,
      bovino_id: row.bovino_id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      precio: row.precio,
      fecha_creacion: row.fecha_creacion,
      activo: row.activo,
      bovino: {
        id: row.bovino_id,
        nombre: row.bovino_nombre,
        raza: row.bovino_raza,
        sexo: row.bovino_sexo,
        edad: row.bovino_edad,
        peso: row.bovino_peso,
        descripcion: row.bovino_descripcion,
        foto_principal: row.bovino_foto_principal,
        ubicacion_municipio: row.bovino_ubicacion_municipio,
        ubicacion_departamento: row.bovino_ubicacion_departamento,
        estado_sanitario: row.bovino_estado_sanitario,
      },
      vendedor: {
        id: row.vendedor_id,
        nombre: row.vendedor_nombre,
        apellidos: row.vendedor_apellidos,
        email: row.vendedor_email,
        telefono: row.vendedor_telefono,
        municipio: row.vendedor_municipio,
        departamento: row.vendedor_departamento,
        foto_perfil: row.vendedor_foto_perfil,
      },
    }));

    return {
      publicaciones,
      paginacion: {
        pagina,
        porPagina,
        total,
        totalPaginas: Math.ceil(total / porPagina),
      },
    };
  }

  static async obtenerPublicacion(id: number) {
    const query = `
      SELECT 
        p.*,
        b.nombre as bovino_nombre,
        b.raza as bovino_raza,
        b.sexo as bovino_sexo,
        b.edad as bovino_edad,
        b.peso as bovino_peso,
        b.descripcion as bovino_descripcion,
        b.foto_principal as bovino_foto_principal,
        b.ubicacion_municipio as bovino_ubicacion_municipio,
        b.ubicacion_departamento as bovino_ubicacion_departamento,
        b.estado_sanitario as bovino_estado_sanitario,
        u.id as vendedor_id,
        u.nombre as vendedor_nombre,
        u.apellidos as vendedor_apellidos,
        u.email as vendedor_email,
        u.telefono as vendedor_telefono,
        u.municipio as vendedor_municipio,
        u.departamento as vendedor_departamento,
        u.foto_perfil as vendedor_foto_perfil
      FROM publicaciones p
      INNER JOIN bovinos b ON p.bovino_id = b.id
      INNER JOIN usuarios u ON p.vendedor_id = u.id
      WHERE p.id = ?
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return {
      id: row.id,
      vendedor_id: row.vendedor_id,
      bovino_id: row.bovino_id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      precio: row.precio,
      fecha_creacion: row.fecha_creacion,
      activo: row.activo,
      bovino: {
        id: row.bovino_id,
        nombre: row.bovino_nombre,
        raza: row.bovino_raza,
        sexo: row.bovino_sexo,
        edad: row.bovino_edad,
        peso: row.bovino_peso,
        descripcion: row.bovino_descripcion,
        foto_principal: row.bovino_foto_principal,
        ubicacion_municipio: row.bovino_ubicacion_municipio,
        ubicacion_departamento: row.bovino_ubicacion_departamento,
        estado_sanitario: row.bovino_estado_sanitario,
      },
      vendedor: {
        id: row.vendedor_id,
        nombre: row.vendedor_nombre,
        apellidos: row.vendedor_apellidos,
        email: row.vendedor_email,
        telefono: row.vendedor_telefono,
        municipio: row.vendedor_municipio,
        departamento: row.vendedor_departamento,
        foto_perfil: row.vendedor_foto_perfil,
      },
    };
  }

  static async crearPublicacion(vendedorId: number, datos: CrearPublicacionDTO) {
    const [bovinos] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM bovinos WHERE id = ? AND propietario_id = ?",
      [datos.bovino_id, vendedorId]
    );

    if (bovinos.length === 0) {
      throw new Error("El bovino no existe o no te pertenece");
    }

    const [publicacionesExistentes] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM publicaciones WHERE bovino_id = ? AND activo = 1",
      [datos.bovino_id]
    );

    if (publicacionesExistentes.length > 0) {
      throw new Error("Este bovino ya tiene una publicación activa");
    }

    const query = `
      INSERT INTO publicaciones (vendedor_id, bovino_id, titulo, descripcion, precio)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query<ResultSetHeader>(query, [
      vendedorId,
      datos.bovino_id,
      datos.titulo,
      datos.descripcion,
      datos.precio,
    ]);

    return this.obtenerPublicacion(result.insertId);
  }

  static async actualizarPublicacion(
    id: number,
    vendedorId: number,
    datos: ActualizarPublicacionDTO
  ) {
    const [publicaciones] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM publicaciones WHERE id = ? AND vendedor_id = ?",
      [id, vendedorId]
    );

    if (publicaciones.length === 0) {
      throw new Error("Publicación no encontrada o no tienes permiso");
    }

    const campos: string[] = [];
    const valores: any[] = [];

    if (datos.titulo !== undefined) {
      campos.push("titulo = ?");
      valores.push(datos.titulo);
    }

    if (datos.descripcion !== undefined) {
      campos.push("descripcion = ?");
      valores.push(datos.descripcion);
    }

    if (datos.precio !== undefined) {
      campos.push("precio = ?");
      valores.push(datos.precio);
    }

    if (datos.activo !== undefined) {
      campos.push("activo = ?");
      valores.push(datos.activo);
    }

    if (campos.length === 0) {
      throw new Error("No hay datos para actualizar");
    }

    valores.push(id);

    const query = `UPDATE publicaciones SET ${campos.join(", ")} WHERE id = ?`;
    await pool.query(query, valores);

    return this.obtenerPublicacion(id);
  }

  static async togglePublicacion(id: number, vendedorId: number) {
    const [publicaciones] = await pool.query<RowDataPacket[]>(
      "SELECT activo FROM publicaciones WHERE id = ? AND vendedor_id = ?",
      [id, vendedorId]
    );

    if (publicaciones.length === 0) {
      throw new Error("Publicación no encontrada o no tienes permiso");
    }

    const nuevoEstado = !publicaciones[0].activo;

    await pool.query("UPDATE publicaciones SET activo = ? WHERE id = ?", [nuevoEstado, id]);

    return this.obtenerPublicacion(id);
  }

  static async eliminarPublicacion(id: number, vendedorId: number) {
    const [publicaciones] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM publicaciones WHERE id = ? AND vendedor_id = ?",
      [id, vendedorId]
    );

    if (publicaciones.length === 0) {
      throw new Error("Publicación no encontrada o no tienes permiso");
    }

    await pool.query("DELETE FROM publicaciones WHERE id = ?", [id]);
  }

  static async obtenerMisPublicaciones(vendedorId: number) {
    const query = `
      SELECT 
        p.*,
        b.nombre as bovino_nombre,
        b.raza as bovino_raza,
        b.sexo as bovino_sexo,
        b.edad as bovino_edad,
        b.peso as bovino_peso,
        b.foto_principal as bovino_foto_principal
      FROM publicaciones p
      INNER JOIN bovinos b ON p.bovino_id = b.id
      WHERE p.vendedor_id = ?
      ORDER BY p.fecha_creacion DESC
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query, [vendedorId]);

    return rows.map((row) => ({
      id: row.id,
      vendedor_id: row.vendedor_id,
      bovino_id: row.bovino_id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      precio: row.precio,
      fecha_creacion: row.fecha_creacion,
      activo: Boolean(row.activo),
      bovino: {
        id: row.bovino_id,
        nombre: row.bovino_nombre,
        raza: row.bovino_raza,
        sexo: row.bovino_sexo,
        edad: row.bovino_edad,
        peso: row.bovino_peso,
        foto_principal: row.bovino_foto_principal,
      },
    }));
  }
}
