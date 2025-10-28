import { Router } from "express";
import authRoutes from "./auth.routes";
import marketplaceRoutes from "./marketplace.routes";
import bovinoRoutes from "./bovino.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/marketplace", marketplaceRoutes);
router.use("/bovinos", bovinoRoutes);

export default router;
