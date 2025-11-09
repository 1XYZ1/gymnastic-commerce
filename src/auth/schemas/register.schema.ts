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
import {
  PASSWORD_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_VALIDATION_MESSAGE,
} from '../constants';

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
      .min(
        PASSWORD_MIN_LENGTH,
        `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`
      )
      .max(
        PASSWORD_MAX_LENGTH,
        `La contraseña no puede exceder ${PASSWORD_MAX_LENGTH} caracteres`
      )
      .regex(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),

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
