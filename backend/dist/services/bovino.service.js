"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BovinoService = void 0;
const database_1 = __importDefault(require("../config/database"));
const http_error_1 = __importDefault(require("../utils/http-error"));
class BovinoService {
    static async obtenerBovinos(propietarioId) {
        const query = `
      SELECT * FROM bovinos 
      WHERE propietario_id = ? AND activo = 1
      ORDER BY registro_fecha DESC
    `;
        const [rows] = await database_1.default.query(query, [propietarioId]);
        return rows;
    }
    static async obtenerBovino(id, propietarioId) {
        const query = `
      SELECT * FROM bovinos 
      WHERE id = ? AND propietario_id = ?
    `;
        const [rows] = await database_1.default.query(query, [id, propietarioId]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    }
    static async crearBovino(propietarioId, datos) {
        const query = `
      INSERT INTO bovinos (
        propietario_id, nombre, raza, sexo, edad, peso,
        ubicacion_municipio, ubicacion_departamento, 
        estado_sanitario, descripcion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const [result] = await database_1.default.query(query, [
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
            throw new http_error_1.default(500, "Error al crear el bovino");
        }
        return bovino;
    }
    static async actualizarBovino(id, propietarioId, datos) {
        const bovino = await this.obtenerBovino(id, propietarioId);
        if (!bovino) {
            throw new http_error_1.default(404, "Bovino no encontrado o no tienes permiso");
        }
        const campos = [];
        const valores = [];
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
            throw new http_error_1.default(400, "No hay datos para actualizar");
        }
        valores.push(id, propietarioId);
        const query = `UPDATE bovinos SET ${campos.join(", ")} WHERE id = ? AND propietario_id = ?`;
        await database_1.default.query(query, valores);
        const bovinoActualizado = await this.obtenerBovino(id, propietarioId);
        if (!bovinoActualizado) {
            throw new http_error_1.default(500, "Error al actualizar el bovino");
        }
        return bovinoActualizado;
    }
    static async eliminarBovino(id, propietarioId) {
        const bovino = await this.obtenerBovino(id, propietarioId);
        if (!bovino) {
            throw new http_error_1.default(404, "Bovino no encontrado o no tienes permiso");
        }
        const [publicaciones] = await database_1.default.query("SELECT id FROM publicaciones WHERE bovino_id = ? AND activo = 1", [id]);
        if (publicaciones.length > 0) {
            throw new http_error_1.default(400, "No se puede eliminar el bovino porque tiene publicaciones activas");
        }
        await database_1.default.query("UPDATE bovinos SET activo = 0 WHERE id = ? AND propietario_id = ?", [
            id,
            propietarioId,
        ]);
    }
    // ==================== MÉTODOS PARA FOTOS ====================
    static async guardarFotos(bovinoId, propietarioId, rutasFotos) {
        // Verificar que el bovino pertenece al usuario
        const bovino = await this.obtenerBovino(bovinoId, propietarioId);
        if (!bovino) {
            throw new http_error_1.default(404, "Bovino no encontrado o no tienes permiso");
        }
        const fotosGuardadas = [];
        for (const ruta of rutasFotos) {
            const query = `
        INSERT INTO bovino_fotos (bovino_id, ruta_foto) 
        VALUES (?, ?)
      `;
            const [result] = await database_1.default.query(query, [bovinoId, ruta]);
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
            await database_1.default.query("UPDATE bovinos SET foto_principal = ? WHERE id = ?", [primeraFoto, bovinoId]);
            await database_1.default.query("UPDATE bovino_fotos SET es_principal = 1 WHERE id = ?", [fotosGuardadas[0].id]);
            fotosGuardadas[0].es_principal = true;
        }
        return fotosGuardadas;
    }
    // Guardar una sola foto y marcarla como principal (reemplaza la principal anterior)
    static async guardarFotoPrincipal(bovinoId, propietarioId, rutaFoto) {
        // Verificar que el bovino pertenece al usuario
        const bovino = await this.obtenerBovino(bovinoId, propietarioId);
        if (!bovino) {
            throw new Error("Bovino no encontrado o no tienes permiso");
        }
        // Insertar nueva foto
        const insertQuery = `INSERT INTO bovino_fotos (bovino_id, ruta_foto) VALUES (?, ?)`;
        const [result] = await database_1.default.query(insertQuery, [bovinoId, rutaFoto]);
        const newFotoId = result.insertId;
        // Desmarcar foto principal anterior (si existe)
        await database_1.default.query(`UPDATE bovino_fotos SET es_principal = 0 WHERE bovino_id = ? AND es_principal = 1`, [bovinoId]);
        // Establecer esta como foto principal en la tabla de fotos y en bovinos
        await database_1.default.query(`UPDATE bovino_fotos SET es_principal = 1 WHERE id = ?`, [newFotoId]);
        await database_1.default.query(`UPDATE bovinos SET foto_principal = ? WHERE id = ?`, [rutaFoto, bovinoId]);
        // Devolver objeto representando la foto
        const [rows] = await database_1.default.query(`SELECT * FROM bovino_fotos WHERE id = ?`, [newFotoId]);
        return rows[0];
    }
    static async obtenerFotos(bovinoId) {
        const query = `
      SELECT * FROM bovino_fotos 
      WHERE bovino_id = ?
      ORDER BY es_principal DESC, fecha_subida DESC
    `;
        const [rows] = await database_1.default.query(query, [bovinoId]);
        return rows;
    }
    // ==================== MÉTODOS PARA HISTORIAL SANITARIO ====================
    static async agregarRegistroSanitario(bovinoId, propietarioId, datos) {
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
        const [result] = await database_1.default.query(query, [
            bovinoId,
            datos.fecha,
            datos.tipo_registro,
            datos.descripcion || null,
            datos.veterinario || null,
            datos.costo || null
        ]);
        const [rows] = await database_1.default.query("SELECT * FROM historial_sanitario WHERE id = ?", [result.insertId]);
        return rows[0];
    }
    static async obtenerHistorialSanitario(bovinoId, propietarioId) {
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
        const [rows] = await database_1.default.query(query, [bovinoId]);
        return rows;
    }
    // ==================== MÉTODOS PARA HISTORIAL REPRODUCTIVO ====================
    static async agregarRegistroReproductivo(bovinoId, propietarioId, datos) {
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
        const [result] = await database_1.default.query(query, [
            bovinoId,
            datos.fecha,
            datos.tipo_evento,
            datos.descripcion || null,
            datos.resultado || null,
            datos.observaciones || null
        ]);
        const [rows] = await database_1.default.query("SELECT * FROM historial_reproductivo WHERE id = ?", [result.insertId]);
        return rows[0];
    }
    static async obtenerHistorialReproductivo(bovinoId, propietarioId) {
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
        const [rows] = await database_1.default.query(query, [bovinoId]);
        return rows;
    }
}
exports.BovinoService = BovinoService;
