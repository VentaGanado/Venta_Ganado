"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, statusCode = 200, data = null, message = "Operación exitosa") => {
    return res.status(statusCode).json({
        success: true,
        data,
        message,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, statusCode = 500, error = "Error", details) => {
    return res.status(statusCode).json({
        success: false,
        error,
        ...(details && { details }),
    });
};
exports.sendError = sendError;
