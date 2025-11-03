"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = process.env.PORT || 3000;
const server = app_1.default.listen(PORT, () => {
    logger_1.default.info(`🚀 Servidor corriendo en puerto ${PORT}`);
    logger_1.default.info(`📍 Entorno: ${process.env.NODE_ENV || "development"}`);
    logger_1.default.info(`🔗 URL: http://localhost:${PORT}`);
});
server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        logger_1.default.error(`Puerto ${PORT} ya está en uso`);
    }
    else {
        logger_1.default.error("Error del servidor:", error);
    }
    process.exit(1);
});
process.on("SIGTERM", () => {
    logger_1.default.info("SIGTERM recibido, cerrando servidor...");
    server.close(() => {
        logger_1.default.info("Servidor cerrado");
        process.exit(0);
    });
});
process.on("SIGINT", () => {
    logger_1.default.info("SIGINT recibido, cerrando servidor...");
    server.close(() => {
        logger_1.default.info("Servidor cerrado");
        process.exit(0);
    });
});
