"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Rutas públicas
router.post('/register', auth_controller_1.AuthController.register);
router.post('/login', auth_controller_1.AuthController.login);
router.post('/refresh', auth_controller_1.AuthController.refresh);
// Rutas protegidas
router.post('/logout', auth_middleware_1.authMiddleware, auth_controller_1.AuthController.logout);
router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.AuthController.me);
exports.default = router;
