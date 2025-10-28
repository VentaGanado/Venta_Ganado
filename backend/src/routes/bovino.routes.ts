import { Router } from "express";
import { BovinoController } from "../controllers/bovino.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", BovinoController.listarBovinos);
router.post("/", BovinoController.crearBovino);
router.get("/:id", BovinoController.obtenerBovino);
router.put("/:id", BovinoController.actualizarBovino);
router.delete("/:id", BovinoController.eliminarBovino);

export default router;
