"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../config/jwt");
const responses_1 = require("../utils/responses");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return (0, responses_1.sendError)(res, 401, 'Token no proporcionado');
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            nombre: decoded.nombre
        };
        req.usuario = {
            id: decoded.id,
            email: decoded.email,
            nombre: decoded.nombre
        };
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return (0, responses_1.sendError)(res, 401, 'Token expirado');
        }
        if (error.name === 'JsonWebTokenError') {
            return (0, responses_1.sendError)(res, 401, 'Token inválido');
        }
        return (0, responses_1.sendError)(res, 401, 'No autorizado');
    }
};
exports.authMiddleware = authMiddleware;
