import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/responses";
import logger from "../utils/logger";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Error no manejado", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err.name === "ZodError") {
    return sendError(res, 400, "Validation Error", err.errors);
  }

  return sendError(res, 500, "Error interno del servidor");
};
