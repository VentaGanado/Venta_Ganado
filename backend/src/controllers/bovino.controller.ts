import { Request, Response, NextFunction } from "express";
import { BovinoService } from "../services/bovino.service";
import { sendSuccess, sendError } from "../utils/responses";
import type { 
  CrearBovinoDTO, 
  ActualizarBovinoDTO,
  CrearRegistroSanitarioDTO,
  CrearRegistroReproductivoDTO
} from "../types/bovino.types";

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

  // POST /api/bovinos/:id/fotos - Subir fotos del bovino
  static async subirFotos(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const propietarioId = req.usuario!.id;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return sendError(res, 400, "No se recibieron archivos");
      }

  // Guardar las rutas de las fotos (ruta relativa dentro de /uploads)
  const rutasFotos = files.map(file => `bovinos/${file.filename}`);
      const fotos = await BovinoService.guardarFotos(id, propietarioId, rutasFotos);

      return sendSuccess(res, 201, { 
        message: "Fotos subidas correctamente",
        fotos 
      });
    } catch (err: any) {
      if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
        return sendError(res, 404, err.message);
      }
      next(err);
    }
  }

  // POST /api/bovinos/:id/foto - Subir una sola foto y marcarla como principal
  static async subirFotoPrincipal(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const propietarioId = req.usuario!.id;
      const file = req.file as Express.Multer.File;

      if (!file) {
        return sendError(res, 400, "No se recibió ningún archivo");
      }

  const rutaFoto = `bovinos/${file.filename}`;

      const foto = await BovinoService.guardarFotoPrincipal(id, propietarioId, rutaFoto);

      return sendSuccess(res, 201, {
        message: "Foto subida y establecida como principal",
        foto,
      });
    } catch (err: any) {
      if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
        return sendError(res, 404, err.message);
      }
      next(err);
    }
  }

  // POST /api/bovinos/:id/sanitario - Agregar registro sanitario
  static async agregarRegistroSanitario(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const propietarioId = req.usuario!.id;
      const datos: CrearRegistroSanitarioDTO = req.body;

      if (!datos.fecha || !datos.tipo_registro) {
        return sendError(res, 400, "Fecha y tipo de registro son campos requeridos");
      }

      const registro = await BovinoService.agregarRegistroSanitario(id, propietarioId, datos);
      return sendSuccess(res, 201, { registro });
    } catch (err: any) {
      if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
        return sendError(res, 404, err.message);
      }
      next(err);
    }
  }

  // GET /api/bovinos/:id/sanitario - Obtener historial sanitario
  static async obtenerHistorialSanitario(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const propietarioId = req.usuario!.id;

      const historial = await BovinoService.obtenerHistorialSanitario(id, propietarioId);
      return sendSuccess(res, 200, { historial });
    } catch (err: any) {
      if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
        return sendError(res, 404, err.message);
      }
      next(err);
    }
  }

  // POST /api/bovinos/:id/reproductivo - Agregar registro reproductivo
  static async agregarRegistroReproductivo(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const propietarioId = req.usuario!.id;
      const datos: CrearRegistroReproductivoDTO = req.body;

      if (!datos.fecha || !datos.tipo_evento) {
        return sendError(res, 400, "Fecha y tipo de evento son campos requeridos");
      }

      const registro = await BovinoService.agregarRegistroReproductivo(id, propietarioId, datos);
      return sendSuccess(res, 201, { registro });
    } catch (err: any) {
      if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
        return sendError(res, 404, err.message);
      }
      next(err);
    }
  }

  // GET /api/bovinos/:id/reproductivo - Obtener historial reproductivo
  static async obtenerHistorialReproductivo(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const propietarioId = req.usuario!.id;

      const historial = await BovinoService.obtenerHistorialReproductivo(id, propietarioId);
      return sendSuccess(res, 200, { historial });
    } catch (err: any) {
      if (err.message.includes("no encontrado") || err.message.includes("no tienes permiso")) {
        return sendError(res, 404, err.message);
      }
      next(err);
    }
  }
}
