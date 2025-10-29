import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import path from "path";
import { errorMiddleware } from "./middlewares/error.middleware";
import routes from "./routes";
import logger from "./utils/logger";

dotenv.config();

const app = express();

// Middlewares de seguridad
// Configurar helmet para permitir servir recursos estáticos desde otro origen (ej. frontend en distinto puerto)
app.use(
  helmet({
    // Permitir que recursos como imágenes se sirvan cross-origin desde el backend hacia el frontend dev server
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  })
);

// Middlewares generales
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Servir archivos estáticos (uploads) y forzar cabeceras para permitir carga desde otro origen
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    setHeaders: (res, filePath) => {
      // Permitir que el frontend (otro puerto/origen) cargue las imágenes
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      // También añadir CORS para que herramientas/requests puedan acceder sin problemas
      res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
    },
  })
);

// Rutas
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

// Montar todas las rutas en /api
app.use("/api", routes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorMiddleware);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Ruta no encontrada",
  });
});

export default app;
