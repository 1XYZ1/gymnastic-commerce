/**
 * Utilidades compartidas para validaciones comunes
 *
 * Centraliza validaciones que se repiten en múltiples schemas Zod
 * y componentes de la aplicación
 */

import { z } from 'zod';

/**
 * Mensajes de error de validación en español
 */
export const VALIDATION_MESSAGES = {
  email: {
    required: 'El email es requerido',
    invalid: 'Email inválido',
  },
  password: {
    required: 'La contraseña es requerida',
    minLength: 'Mínimo 6 caracteres',
    pattern: 'Debe contener al menos una mayúscula, una minúscula y un número o carácter especial',
  },
  string: {
    required: 'Este campo es requerido',
    minLength: (min: number) => `Mínimo ${min} caracteres`,
    maxLength: (max: number) => `Máximo ${max} caracteres`,
  },
  number: {
    required: 'Este campo es requerido',
    positive: 'Debe ser un número positivo',
    min: (min: number) => `El valor mínimo es ${min}`,
    max: (max: number) => `El valor máximo es ${max}`,
  },
  date: {
    required: 'La fecha es requerida',
    invalid: 'Fecha inválida',
    notFuture: 'La fecha no puede ser futura',
    notPast: 'La fecha no puede ser pasada',
  },
};

/**
 * Schema reutilizable para email
 */
export const emailSchema = z
  .string({ message: VALIDATION_MESSAGES.email.required })
  .min(1, VALIDATION_MESSAGES.email.required)
  .email(VALIDATION_MESSAGES.email.invalid);

/**
 * Schema reutilizable para password con reglas del backend
 * Regex: /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
 */
export const passwordSchema = z
  .string({ message: VALIDATION_MESSAGES.password.required })
  .min(6, VALIDATION_MESSAGES.password.minLength)
  .max(50, VALIDATION_MESSAGES.string.maxLength(50))
  .regex(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    VALIDATION_MESSAGES.password.pattern
  );

/**
 * Schema reutilizable para string no vacío
 */
export function requiredString(minLength = 1, maxLength = 255) {
  return z
    .string({ message: VALIDATION_MESSAGES.string.required })
    .min(minLength, VALIDATION_MESSAGES.string.minLength(minLength))
    .max(maxLength, VALIDATION_MESSAGES.string.maxLength(maxLength));
}

/**
 * Schema reutilizable para string opcional
 */
export function optionalString(maxLength = 255) {
  return z.string().max(maxLength, VALIDATION_MESSAGES.string.maxLength(maxLength)).optional();
}

/**
 * Schema reutilizable para números positivos
 */
export function positiveNumber(min?: number, max?: number) {
  let schema = z
    .number({ message: VALIDATION_MESSAGES.number.required })
    .positive(VALIDATION_MESSAGES.number.positive);

  if (min !== undefined) {
    schema = schema.min(min, VALIDATION_MESSAGES.number.min(min));
  }

  if (max !== undefined) {
    schema = schema.max(max, VALIDATION_MESSAGES.number.max(max));
  }

  return schema;
}

/**
 * Schema reutilizable para número opcional positivo
 */
export function optionalPositiveNumber() {
  return z.number().positive(VALIDATION_MESSAGES.number.positive).optional();
}

/**
 * Schema para fecha que no puede ser futura
 */
export function pastOrPresentDate(errorMessage?: string) {
  return z.string().refine(
    (date) => {
      const dateObj = new Date(date);
      return dateObj <= new Date();
    },
    {
      message: errorMessage || VALIDATION_MESSAGES.date.notFuture,
    }
  );
}

/**
 * Schema para fecha que debe ser futura
 */
export function futureDate(errorMessage?: string) {
  return z.string().refine(
    (date) => {
      const dateObj = new Date(date);
      return dateObj > new Date();
    },
    {
      message: errorMessage || VALIDATION_MESSAGES.date.notPast,
    }
  );
}

/**
 * Schema para fecha ISO válida
 */
export const isoDateSchema = z.string().refine(
  (date) => {
    try {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    } catch {
      return false;
    }
  },
  { message: VALIDATION_MESSAGES.date.invalid }
);

/**
 * Valida un email con expresión regular
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida un password según reglas del backend
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 6 || password.length > 50) return false;

  const passwordRegex = /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
  return passwordRegex.test(password);
}

/**
 * Valida que un número esté en un rango
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Valida que un string tenga longitud mínima
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

/**
 * Valida que un string tenga longitud máxima
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength;
}

/**
 * Sanitiza un string removiendo caracteres especiales peligrosos (XSS básico)
 */
export function sanitizeString(value: string): string {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Valida formato de teléfono (10 dígitos)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
}
