"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
    apellidos: zod_1.z.string().min(2, 'Apellidos debe tener al menos 2 caracteres').max(100),
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(8, 'Contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número'),
    telefono: zod_1.z.string().regex(/^[0-9]{10}$/, 'Teléfono debe tener 10 dígitos').optional(),
    municipio: zod_1.z.string().min(2, 'Municipio requerido').max(100),
    departamento: zod_1.z.string().default('Boyacá')
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(1, 'Contraseña requerida')
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token requerido')
});
