import { Request, Response, NextFunction } from "express";
import { MarketplaceService } from "../services/marketplace.service";
import { sendSuccess, sendError } from "../utils/responses";
import type { CrearPublicacionDTO, ActualizarPublicacionDTO } from "../types/publicacion.types";

export class MarketplaceController {
  // GET /api/marketplace - Obtener publicaciones con filtros
  static async obtenerPublicaciones(req: Request, res: Response, next: NextFunction) {
    try {
      const filtros = {
        raza: req.query.raza as string,
        sexo: req.query.sexo as 'M' | 'F',
        edadMin: req.query.edadMin ? Number(req.query.edadMin) : undefined,
        edadMax: req.query.edadMax ? Number(req.query.edadMax) : undefined,
        pesoMin: req.query.pesoMin ? Number(req.query.pesoMin) : undefined,
        pesoMax: req.query.pesoMax ? Number(req.query.pesoMax) : undefined,
        precioMin: req.query.precioMin ? Number(req.query.precioMin) : undefined,
        precioMax: req.query.precioMax ? Number(req.query.precioMax) : undefined,
        municipio: req.query.municipio as string,
        departamento: req.query.departamento as string,
        vacunasAlDia: req.query.vacunasAlDia === 'true',
        busqueda: req.query.busqueda as string,
        ordenarPor: (req.query.ordenarPor as any) || 'fecha_creacion',
        direccion: (req.query.direccion as any) || 'desc',
        pagina: req.query.pagina ? Number(req.query.pagina) : 1,
        porPagina: req.query.porPagina ? Number(req.query.porPagina) : 12,
      };

      const resultado = await MarketplaceService.obtenerPublicaciones(filtros);
      return sendSuccess(res, 200, resultado);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/marketplace/:id - Obtener una publicación específica
  static async obtenerPublicacion(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const publicacion = await MarketplaceService.obtenerPublicacion(id);

      if (!publicacion) {
        return sendError(res, 404, "Publicación no encontrada");
      }

      return sendSuccess(res, 200, publicacion);
    } catch (err) {
      next(err);
    }
  }

  // POST /api/marketplace - Crear una nueva publicación
  static async crearPublicacion(req: Request, res: Response, next: NextFunction) {
    try {
      const vendedorId = req.usuario!.id;
      const datos: CrearPublicacionDTO = req.body;

      // Validaciones básicas
      if (!datos.bovino_id || !datos.titulo || !datos.descripcion || !datos.precio) {
        return sendError(res, 400, "Faltan campos requeridos");
      }

      if (datos.precio <= 0) {
        return sendError(res, 400, "El precio debe ser mayor a 0");
      }

      const publicacion = await MarketplaceService.crearPublicacion(vendedorId, datos);
      return sendSuccess(res, 201, publicacion);
    } catch (err: any) {
      if (err.message.includes("ya tiene una publicación")) {
        return sendError(res, 400, err.message);
      }
      next(err);
    }
  }

  // PUT /api/marketplace/:id - Actualizar una publicación
  static async actualizarPublicacion(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const vendedorId = req.usuario!.id;
      const datos: ActualizarPublicacionDTO = req.body;

      if (datos.precio !== undefined && datos.precio <= 0) {
        return sendError(res, 400, "El precio debe ser mayor a 0");
      }

      const publicacion = await MarketplaceService.actualizarPublicacion(id, vendedorId, datos);
      return sendSuccess(res, 200, publicacion);
    } catch (err: any) {
      if (err.message.includes("no encontrada") || err.message.includes("no tienes permiso")) {
        return sendError(res, 404, err.message);
      }
      next(err);
    }
  }

  // PATCH /api/marketplace/:id/toggle - Activar/Desactivar publicación
  static async togglePublicacion(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const vendedorId = req.usuario!.id;

      const publicacion = await MarketplaceService.togglePublicacion(id, vendedorId);
      return sendSuccess(res, 200, publicacion);
    } catch (err: any) {
      if (err.message.includes("no encontrada") || err.message.includes("no tienes permiso")) {
        return sendError(res, 404, err.message);
      }
      next(err);
    }
  }

  // DELETE /api/marketplace/:id - Eliminar publicación
  static async eliminarPublicacion(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const vendedorId = req.usuario!.id;

      await MarketplaceService.eliminarPublicacion(id, vendedorId);
      return sendSuccess(res, 200, { message: "Publicación eliminada correctamente" });
    } catch (err: any) {
      if (err.message.includes("no encontrada") || err.message.includes("no tienes permiso")) {
        return sendError(res, 404, err.message);
      }
      next(err);
    }
  }

  // GET /api/marketplace/mis-publicaciones - Obtener mis publicaciones
  static async obtenerMisPublicaciones(req: Request, res: Response, next: NextFunction) {
    try {
      const vendedorId = req.usuario!.id;
      const publicaciones = await MarketplaceService.obtenerMisPublicaciones(vendedorId);
      return sendSuccess(res, 200, publicaciones);
    } catch (err) {
      next(err);
    }
  }
}
