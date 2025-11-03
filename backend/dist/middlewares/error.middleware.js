"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const responses_1 = require("../utils/responses");
const logger_1 = __importDefault(require("../utils/logger"));
const http_error_1 = __importDefault(require("../utils/http-error"));
const errorMiddleware = (err, req, res, next) => {
    logger_1.default.error("Error no manejado", {
        error: err?.message,
        stack: err?.stack,
        path: req.path,
        method: req.method,
    });
    // Zod validation errors
    if (err?.name === "ZodError") {
        return (0, responses_1.sendError)(res, 400, "Validation Error", err.errors);
    }
    // HttpError thrown from services/controllers
    if (err instanceof http_error_1.default) {
        return (0, responses_1.sendError)(res, err.status || 500, err.message, err.details);
    }
    return (0, responses_1.sendError)(res, 500, "Error interno del servidor");
};
exports.errorMiddleware = errorMiddleware;
