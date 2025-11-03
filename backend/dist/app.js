"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const error_middleware_1 = require("./middlewares/error.middleware");
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares de seguridad
// Configurar helmet para permitir servir recursos estáticos desde otro origen (ej. frontend en distinto puerto)
app.use((0, helmet_1.default)({
    // Permitir que recursos como imágenes se sirvan cross-origin desde el backend hacia el frontend dev server
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
}));
// Middlewares generales
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Servir archivos estáticos (uploads) y forzar cabeceras para permitir carga desde otro origen
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads"), {
    setHeaders: (res, filePath) => {
        // Permitir que el frontend (otro puerto/origen) cargue las imágenes
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        // También añadir CORS para que herramientas/requests puedan acceder sin problemas
        res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
    },
}));
// Rutas
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "API funcionando correctamente",
        timestamp: new Date().toISOString(),
    });
});
// Montar todas las rutas en /api
app.use("/api", routes_1.default);
// Middleware de manejo de errores (debe ir al final)
app.use(error_middleware_1.errorMiddleware);
// Ruta 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Ruta no encontrada",
    });
});
exports.default = app;
