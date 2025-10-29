import { Router } from "express";
import { BovinoController } from "../controllers/bovino.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadFotoBovino } from "../config/multer";

const router = Router();

router.use(authMiddleware);

router.get("/", BovinoController.listarBovinos);
router.post("/", BovinoController.crearBovino);
router.get("/:id", BovinoController.obtenerBovino);
router.put("/:id", BovinoController.actualizarBovino);
router.delete("/:id", BovinoController.eliminarBovino);

// Rutas de fotos
router.post("/:id/fotos", uploadFotoBovino.array('fotos', 5), BovinoController.subirFotos);
// Subir una sola foto y marcarla como principal
router.post("/:id/foto", uploadFotoBovino.single('foto'), BovinoController.subirFotoPrincipal);

// Rutas de historial sanitario
router.post("/:id/sanitario", BovinoController.agregarRegistroSanitario);
router.get("/:id/sanitario", BovinoController.obtenerHistorialSanitario);

// Rutas de historial reproductivo
router.post("/:id/reproductivo", BovinoController.agregarRegistroReproductivo);
router.get("/:id/reproductivo", BovinoController.obtenerHistorialReproductivo);

export default router;
