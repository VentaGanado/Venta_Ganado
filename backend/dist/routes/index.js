"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const marketplace_routes_1 = __importDefault(require("./marketplace.routes"));
const bovino_routes_1 = __importDefault(require("./bovino.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/marketplace", marketplace_routes_1.default);
router.use("/bovinos", bovino_routes_1.default);
exports.default = router;
