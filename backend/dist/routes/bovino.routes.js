"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bovino_controller_1 = require("../controllers/bovino.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = require("../config/multer");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get("/", bovino_controller_1.BovinoController.listarBovinos);
router.post("/", bovino_controller_1.BovinoController.crearBovino);
router.get("/:id", bovino_controller_1.BovinoController.obtenerBovino);
router.put("/:id", bovino_controller_1.BovinoController.actualizarBovino);
router.delete("/:id", bovino_controller_1.BovinoController.eliminarBovino);
// Rutas de fotos
router.post("/:id/fotos", multer_1.uploadFotoBovino.array('fotos', 5), bovino_controller_1.BovinoController.subirFotos);
// Subir una sola foto y marcarla como principal
router.post("/:id/foto", multer_1.uploadFotoBovino.single('foto'), bovino_controller_1.BovinoController.subirFotoPrincipal);
// Rutas de historial sanitario
router.post("/:id/sanitario", bovino_controller_1.BovinoController.agregarRegistroSanitario);
router.get("/:id/sanitario", bovino_controller_1.BovinoController.obtenerHistorialSanitario);
// Rutas de historial reproductivo
router.post("/:id/reproductivo", bovino_controller_1.BovinoController.agregarRegistroReproductivo);
router.get("/:id/reproductivo", bovino_controller_1.BovinoController.obtenerHistorialReproductivo);
exports.default = router;
