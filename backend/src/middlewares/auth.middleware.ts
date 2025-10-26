import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../config/jwt';
import { sendError } from '../utils/responses';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Token no proporcionado');
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = verifyAccessToken(token) as any;
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      nombre: decoded.nombre
    };
    
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 401, 'Token inválido');
    }
    return sendError(res, 401, 'No autorizado');
  }
};