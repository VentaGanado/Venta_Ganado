import { Router } from "express";
import { MarketplaceController } from "../controllers/marketplace.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Rutas protegidas que deben ir primero (más específicas)
router.get("/mis-publicaciones", authMiddleware, MarketplaceController.obtenerMisPublicaciones);
router.post("/", authMiddleware, MarketplaceController.crearPublicacion);
router.put("/:id", authMiddleware, MarketplaceController.actualizarPublicacion);
router.patch("/:id/toggle", authMiddleware, MarketplaceController.togglePublicacion);
router.delete("/:id", authMiddleware, MarketplaceController.eliminarPublicacion);

// Rutas públicas (ver publicaciones) - van después
router.get("/", MarketplaceController.obtenerPublicaciones);
router.get("/:id", MarketplaceController.obtenerPublicacion);

export default router;
