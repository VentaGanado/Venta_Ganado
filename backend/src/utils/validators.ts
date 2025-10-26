import { z } from 'zod';

// Esquema de registro
export const registerSchema = z.object({
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
  apellidos: z.string().min(2, 'Apellidos debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  telefono: z.string().regex(/^[0-9]{10}$/, 'Teléfono debe tener 10 dígitos').optional(),
  municipio: z.string().min(2, 'Municipio requerido').max(100),
  departamento: z.string().default('Boyacá')
});

// Esquema de login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida')
});

// Esquema de refresh token
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token requerido')
});