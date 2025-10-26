import { Response } from "express";

export const sendSuccess = (
  res: Response,
  statusCode: number = 200,
  data: any = null,
  message: string = "Operación exitosa"
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const sendError = (
  res: Response,
  statusCode: number = 500,
  error: string = "Error",
  details?: any
) => {
  return res.status(statusCode).json({
    success: false,
    error,
    ...(details && { details }),
  });
};
