import app from "./app";
import logger from "./utils/logger";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en puerto ${PORT}`);
  logger.info(`📍 Entorno: ${process.env.NODE_ENV || "development"}`);
  logger.info(`🔗 URL: http://localhost:${PORT}`);
});

server.on("error", (error: any) => {
  if (error.code === "EADDRINUSE") {
    logger.error(`Puerto ${PORT} ya está en uso`);
  } else {
    logger.error("Error del servidor:", error);
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM recibido, cerrando servidor...");
  server.close(() => {
    logger.info("Servidor cerrado");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT recibido, cerrando servidor...");
  server.close(() => {
    logger.info("Servidor cerrado");
    process.exit(0);
  });
});
