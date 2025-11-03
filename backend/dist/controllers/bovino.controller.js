"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BovinoController = void 0;
const bovino_service_1 = require("../services/bovino.service");
const responses_1 = require("../utils/responses");
class BovinoController {
    // GET /api/bovinos - Listar bovinos del propietario
    static async listarBovinos(req, res, next) {
        try {
            const propietarioId = req.usuario.id;
            const bovinos = await bovino_service_1.BovinoService.obtenerBovinos(propietarioId);
            return (0, responses_1.sendSuccess)(res, 200, { bovinos });
        }
        catch (err) {
            next(err);
        }
    }
    // GET /api/bovinos/:id - Obtener un bovino específico
    static async obtenerBovino(req, res, next) {
        try {
            const id = Number(req.params.id);
            const propietarioId = req.usuario.id;
            const bovino = await bovino_service_1.BovinoService.obtenerBovino(id, propietarioId);
            if (!bovino) {
                return (0, responses_1.sendError)(res, 404, "Bovino no encontrado");
            }
            return (0, responses_1.sendSuccess)(res, 200, { bovino });
        }
        catch (err) {
            next(err);
        }
    }
    // POST /api/bovinos - Crear un bovino
    static async crearBovino(req, res, next) {
        try {
            const propietarioId = req.usuario.id;
            const datos = req.body;
            if (!datos.raza || !datos.sexo) {
                return (0, responses_1.sendError)(res, 400, "Raza y sexo son campos requeridos");
            }
            if (datos.sexo !== 'M' && datos.sexo !== 'F') {
                return (0, responses_1.sendError)(res, 400, "El sexo debe ser 'M' o 'F'");
            }
            const bovino = await bovino_service_1.BovinoService.crearBovino(propietarioId, datos);
            return (0, responses_1.sendSuccess)(res, 201, { id: bovino.id, bovino });
        }
        catch (err) {
            if (err.message.includes("requerido")) {
                return (0, responses_1.sendError)(res, 400, err.message);
            }
            next(err);
        }
    }
    // PUT /api/bovinos/:id - Actualizar un bovino
    static async actualizarBovino(req, res, next) {
        try {
            const id = Number(req.params.id);
            const propietarioId = req.usuario.id;
            const datos = req.body;
            if (datos.sexo && datos.sexo !== 'M' && datos.sexo !== 'F') {
                return (0, responses_1.sendError)(res, 400, "El sexo debe ser 'M' o 'F'");
            }
            const bovino = await bovino_service_1.BovinoService.actualizarBovino(id, propietarioId, datos);
            return (0, responses_1.sendSuccess)(res, 200, { bovino });
        }
        catch (err) {
            if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
                return (0, responses_1.sendError)(res, 404, err.message);
            }
            next(err);
        }
    }
    // DELETE /api/bovinos/:id - Eliminar (desactivar) un bovino
    static async eliminarBovino(req, res, next) {
        try {
            const id = Number(req.params.id);
            const propietarioId = req.usuario.id;
            await bovino_service_1.BovinoService.eliminarBovino(id, propietarioId);
            return (0, responses_1.sendSuccess)(res, 200, { message: "Bovino eliminado correctamente" });
        }
        catch (err) {
            if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
                return (0, responses_1.sendError)(res, 404, err.message);
            }
            if (err.message.includes("publicaciones activas")) {
                return (0, responses_1.sendError)(res, 400, err.message);
            }
            next(err);
        }
    }
    // POST /api/bovinos/:id/fotos - Subir fotos del bovino
    static async subirFotos(req, res, next) {
        try {
            const id = Number(req.params.id);
            const propietarioId = req.usuario.id;
            const files = req.files;
            if (!files || files.length === 0) {
                return (0, responses_1.sendError)(res, 400, "No se recibieron archivos");
            }
            // Guardar las rutas de las fotos (ruta relativa dentro de /uploads)
            const rutasFotos = files.map(file => `bovinos/${file.filename}`);
            const fotos = await bovino_service_1.BovinoService.guardarFotos(id, propietarioId, rutasFotos);
            return (0, responses_1.sendSuccess)(res, 201, {
                message: "Fotos subidas correctamente",
                fotos
            });
        }
        catch (err) {
            if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
                return (0, responses_1.sendError)(res, 404, err.message);
            }
            next(err);
        }
    }
    // POST /api/bovinos/:id/foto - Subir una sola foto y marcarla como principal
    static async subirFotoPrincipal(req, res, next) {
        try {
            const id = Number(req.params.id);
            const propietarioId = req.usuario.id;
            const file = req.file;
            if (!file) {
                return (0, responses_1.sendError)(res, 400, "No se recibió ningún archivo");
            }
            const rutaFoto = `bovinos/${file.filename}`;
            const foto = await bovino_service_1.BovinoService.guardarFotoPrincipal(id, propietarioId, rutaFoto);
            return (0, responses_1.sendSuccess)(res, 201, {
                message: "Foto subida y establecida como principal",
                foto,
            });
        }
        catch (err) {
            if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
                return (0, responses_1.sendError)(res, 404, err.message);
            }
            next(err);
        }
    }
    // POST /api/bovinos/:id/sanitario - Agregar registro sanitario
    static async agregarRegistroSanitario(req, res, next) {
        try {
            const id = Number(req.params.id);
            const propietarioId = req.usuario.id;
            const datos = req.body;
            if (!datos.fecha || !datos.tipo_registro) {
                return (0, responses_1.sendError)(res, 400, "Fecha y tipo de registro son campos requeridos");
            }
            const registro = await bovino_service_1.BovinoService.agregarRegistroSanitario(id, propietarioId, datos);
            return (0, responses_1.sendSuccess)(res, 201, { registro });
        }
        catch (err) {
            if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
                return (0, responses_1.sendError)(res, 404, err.message);
            }
            next(err);
        }
    }
    // GET /api/bovinos/:id/sanitario - Obtener historial sanitario
    static async obtenerHistorialSanitario(req, res, next) {
        try {
            const id = Number(req.params.id);
            const propietarioId = req.usuario.id;
            const historial = await bovino_service_1.BovinoService.obtenerHistorialSanitario(id, propietarioId);
            return (0, responses_1.sendSuccess)(res, 200, { historial });
        }
        catch (err) {
            if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
                return (0, responses_1.sendError)(res, 404, err.message);
            }
            next(err);
        }
    }
    // POST /api/bovinos/:id/reproductivo - Agregar registro reproductivo
    static async agregarRegistroReproductivo(req, res, next) {
        try {
            const id = Number(req.params.id);
            const propietarioId = req.usuario.id;
            const datos = req.body;
            if (!datos.fecha || !datos.tipo_evento) {
                return (0, responses_1.sendError)(res, 400, "Fecha y tipo de evento son campos requeridos");
            }
            const registro = await bovino_service_1.BovinoService.agregarRegistroReproductivo(id, propietarioId, datos);
            return (0, responses_1.sendSuccess)(res, 201, { registro });
        }
        catch (err) {
            if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
                return (0, responses_1.sendError)(res, 404, err.message);
            }
            next(err);
        }
    }
    // GET /api/bovinos/:id/reproductivo - Obtener historial reproductivo
    static async obtenerHistorialReproductivo(req, res, next) {
        try {
            const id = Number(req.params.id);
            const propietarioId = req.usuario.id;
            const historial = await bovino_service_1.BovinoService.obtenerHistorialReproductivo(id, propietarioId);
            return (0, responses_1.sendSuccess)(res, 200, { historial });
        }
        catch (err) {
            if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
                return (0, responses_1.sendError)(res, 404, err.message);
            }
            next(err);
        }
    }
}
exports.BovinoController = BovinoController;
