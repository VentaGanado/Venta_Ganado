"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceController = void 0;
const marketplace_service_1 = require("../services/marketplace.service");
const responses_1 = require("../utils/responses");
class MarketplaceController {
    // GET /api/marketplace - Obtener publicaciones con filtros
    static async obtenerPublicaciones(req, res, next) {
        try {
            const filtros = {
                raza: req.query.raza,
                sexo: req.query.sexo,
                edadMin: req.query.edadMin ? Number(req.query.edadMin) : undefined,
                edadMax: req.query.edadMax ? Number(req.query.edadMax) : undefined,
                pesoMin: req.query.pesoMin ? Number(req.query.pesoMin) : undefined,
                pesoMax: req.query.pesoMax ? Number(req.query.pesoMax) : undefined,
                precioMin: req.query.precioMin ? Number(req.query.precioMin) : undefined,
                precioMax: req.query.precioMax ? Number(req.query.precioMax) : undefined,
                municipio: req.query.municipio,
                departamento: req.query.departamento,
                vacunasAlDia: req.query.vacunasAlDia === 'true',
                busqueda: req.query.busqueda,
                ordenarPor: req.query.ordenarPor || 'fecha_creacion',
                direccion: req.query.direccion || 'desc',
                pagina: req.query.pagina ? Number(req.query.pagina) : 1,
                porPagina: req.query.porPagina ? Number(req.query.porPagina) : 12,
            };
            const resultado = await marketplace_service_1.MarketplaceService.obtenerPublicaciones(filtros);
            return (0, responses_1.sendSuccess)(res, 200, resultado);
        }
        catch (err) {
            next(err);
        }
    }
    // GET /api/marketplace/:id - Obtener una publicación específica
    static async obtenerPublicacion(req, res, next) {
        try {
            const id = Number(req.params.id);
            const publicacion = await marketplace_service_1.MarketplaceService.obtenerPublicacion(id);
            if (!publicacion) {
                return (0, responses_1.sendError)(res, 404, "Publicación no encontrada");
            }
            return (0, responses_1.sendSuccess)(res, 200, publicacion);
        }
        catch (err) {
            next(err);
        }
    }
    // POST /api/marketplace - Crear una nueva publicación
    static async crearPublicacion(req, res, next) {
        try {
            const vendedorId = req.usuario.id;
            const datos = req.body;
            if (!datos.bovino_id || !datos.titulo || !datos.descripcion || !datos.precio) {
                return (0, responses_1.sendError)(res, 400, "Faltan campos requeridos");
            }
            if (datos.precio <= 0) {
                return (0, responses_1.sendError)(res, 400, "El precio debe ser mayor a 0");
            }
            const publicacion = await marketplace_service_1.MarketplaceService.crearPublicacion(vendedorId, datos);
            return (0, responses_1.sendSuccess)(res, 201, publicacion);
        }
        catch (err) {
            if (err.message.includes("ya tiene una publicación")) {
                return (0, responses_1.sendError)(res, 400, err.message);
            }
            next(err);
        }
    }
    // PUT /api/marketplace/:id - Actualizar una publicación
    static async actualizarPublicacion(req, res, next) {
        try {
            const id = Number(req.params.id);
            const vendedorId = req.usuario.id;
            const datos = req.body;
            if (datos.precio !== undefined && datos.precio <= 0) {
                return (0, responses_1.sendError)(res, 400, "El precio debe ser mayor a 0");
            }
            const publicacion = await marketplace_service_1.MarketplaceService.actualizarPublicacion(id, vendedorId, datos);
            return (0, responses_1.sendSuccess)(res, 200, publicacion);
        }
        catch (err) {
            if (err.message.includes("no encontrada") || err.message.includes("no tienes permiso")) {
                return (0, responses_1.sendError)(res, 404, err.message);
            }
            next(err);
        }
    }
    // PATCH /api/marketplace/:id/toggle - Activar/Desactivar publicación
    static async togglePublicacion(req, res, next) {
        try {
            const id = Number(req.params.id);
            const vendedorId = req.usuario.id;
            const publicacion = await marketplace_service_1.MarketplaceService.togglePublicacion(id, vendedorId);
            return (0, responses_1.sendSuccess)(res, 200, publicacion);
        }
        catch (err) {
            if (err.message.includes("no encontrada") || err.message.includes("no tienes permiso")) {
                return (0, responses_1.sendError)(res, 404, err.message);
            }
            next(err);
        }
    }
    // DELETE /api/marketplace/:id - Eliminar publicación
    static async eliminarPublicacion(req, res, next) {
        try {
            const id = Number(req.params.id);
            const vendedorId = req.usuario.id;
            await marketplace_service_1.MarketplaceService.eliminarPublicacion(id, vendedorId);
            return (0, responses_1.sendSuccess)(res, 200, { message: "Publicación eliminada correctamente" });
        }
        catch (err) {
            if (err.message.includes("no encontrada") || err.message.includes("no tienes permiso")) {
                return (0, responses_1.sendError)(res, 404, err.message);
            }
            next(err);
        }
    }
    // GET /api/marketplace/mis-publicaciones - Obtener mis publicaciones
    static async obtenerMisPublicaciones(req, res, next) {
        try {
            const vendedorId = req.usuario.id;
            const publicaciones = await marketplace_service_1.MarketplaceService.obtenerMisPublicaciones(vendedorId);
            return (0, responses_1.sendSuccess)(res, 200, publicaciones);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.MarketplaceController = MarketplaceController;
