import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/responses";
import logger from "../utils/logger";
import HttpError from "../utils/http-error";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Error no manejado", {
    error: err?.message,
    stack: err?.stack,
    path: req.path,
    method: req.method,
  });

  // Zod validation errors
  if (err?.name === "ZodError") {
    return sendError(res, 400, "Validation Error", err.errors);
  }

  // HttpError thrown from services/controllers
  if (err instanceof HttpError) {
    return sendError(res, err.status || 500, err.message, err.details);
  }

  return sendError(res, 500, "Error interno del servidor");
};
