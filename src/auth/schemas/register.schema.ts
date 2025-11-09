/**
 * Schema de validación Zod para registro de usuarios
 *
 * IMPORTANTE: Las reglas deben coincidir EXACTAMENTE con el backend
 * Backend requiere:
 * - fullName: mínimo 1 carácter
 * - email: email válido (único en BD, validación en backend)
 * - password: regex /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
 *   - Mínimo 6 caracteres, máximo 50
 *   - Al menos UNA mayúscula
 *   - Al menos UNA minúscula
 *   - Al menos UN número O carácter especial
 */

import { z } from 'zod';

// Regex de contraseña EXACTA del backend
// Coincide con: pet-shop-back/src/auth/dto/create-user.dto.ts
const PASSWORD_REGEX = /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'El nombre completo es requerido')
      .max(100, 'El nombre no puede exceder 100 caracteres')
      .trim(),

    email: z
      .string()
      .min(1, 'El correo electrónico es requerido')
      .email('Ingresa un correo electrónico válido')
      .toLowerCase()
      .trim(),

    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .max(50, 'La contraseña no puede exceder 50 caracteres')
      .regex(
        PASSWORD_REGEX,
        'La contraseña debe contener: al menos una mayúscula, una minúscula, y un número o carácter especial'
      ),

    confirmPassword: z
      .string()
      .min(1, 'Debes confirmar tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'], // Error se muestra en el campo confirmPassword
  });

// Tipo inferido del schema
export type RegisterFormData = z.infer<typeof registerSchema>;

// Tipo para enviar al backend (sin confirmPassword)
export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}
