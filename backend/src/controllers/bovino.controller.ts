import { Request, Response, NextFunction } from "express";
import { BovinoService } from "../services/bovino.service";
import { sendSuccess, sendError } from "../utils/responses";
import type { CrearBovinoDTO, ActualizarBovinoDTO } from "../types/bovino.types";

export class BovinoController {
  // GET /api/bovinos - Listar bovinos del propietario
  static async listarBovinos(req: Request, res: Response, next: NextFunction) {
    try {
      const propietarioId = req.usuario!.id;
      const bovinos = await BovinoService.obtenerBovinos(propietarioId);
      return sendSuccess(res, 200, { bovinos });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/bovinos/:id - Obtener un bovino específico
  static async obtenerBovino(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const propietarioId = req.usuario!.id;

      const bovino = await BovinoService.obtenerBovino(id, propietarioId);

      if (!bovino) {
        return sendError(res, 404, "Bovino no encontrado");
      }

      return sendSuccess(res, 200, { bovino });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/bovinos - Crear un bovino
  static async crearBovino(req: Request, res: Response, next: NextFunction) {
    try {
      const propietarioId = req.usuario!.id;
      const datos: CrearBovinoDTO = req.body;

      // Validaciones básicas
      if (!datos.raza || !datos.sexo) {
        return sendError(res, 400, "Raza y sexo son campos requeridos");
      }

      if (datos.sexo !== 'M' && datos.sexo !== 'F') {
        return sendError(res, 400, "El sexo debe ser 'M' o 'F'");
      }

      const bovino = await BovinoService.crearBovino(propietarioId, datos);
      return sendSuccess(res, 201, { id: bovino.id, bovino });
    } catch (err: any) {
      if (err.message.includes("requerido")) {
        return sendError(res, 400, err.message);
      }
      next(err);
    }
  }

  // PUT /api/bovinos/:id - Actualizar un bovino
  static async actualizarBovino(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const propietarioId = req.usuario!.id;
      const datos: ActualizarBovinoDTO = req.body;

      if (datos.sexo && datos.sexo !== 'M' && datos.sexo !== 'F') {
        return sendError(res, 400, "El sexo debe ser 'M' o 'F'");
      }

      const bovino = await BovinoService.actualizarBovino(id, propietarioId, datos);
      return sendSuccess(res, 200, { bovino });
    } catch (err: any) {
      if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
        return sendError(res, 404, err.message);
      }
      next(err);
    }
  }

  // DELETE /api/bovinos/:id - Eliminar (desactivar) un bovino
  static async eliminarBovino(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const propietarioId = req.usuario!.id;

      await BovinoService.eliminarBovino(id, propietarioId);
      return sendSuccess(res, 200, { message: "Bovino eliminado correctamente" });
    } catch (err: any) {
      if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
        return sendError(res, 404, err.message);
      }
      if (err.message.includes("publicaciones activas")) {
        return sendError(res, 400, err.message);
      }
      next(err);
    }
  }
}
