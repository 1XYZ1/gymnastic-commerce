/**
 * Constantes de validación de contraseña
 *
 * IMPORTANTE: Estas constantes DEBEN coincidir exactamente con el backend
 * Ubicación backend: pet-shop-back/src/auth/constants/password-validation.constants.ts
 *
 * Sincronizado el: 2025-11-09
 */

/**
 * Regex de validación de contraseña
 *
 * Requisitos:
 * - Al menos UNA mayúscula
 * - Al menos UNA minúscula
 * - Al menos UN número O carácter especial
 * - Entre 6 y 50 caracteres
 *
 * Ejemplos válidos: "Password1", "MyPass!", "Secret@2024"
 * Ejemplos inválidos: "password", "PASSWORD", "Pass"
 */
export const PASSWORD_REGEX = /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 50;

/**
 * Mensaje de validación mostrado al usuario
 * Traducción al español del mensaje del backend
 */
export const PASSWORD_VALIDATION_MESSAGE =
  'La contraseña debe contener: al menos una mayúscula, una minúscula, y un número o carácter especial';

/**
 * Mensaje en inglés (coincide con backend)
 */
export const PASSWORD_VALIDATION_MESSAGE_EN =
  'The password must have a Uppercase, lowercase letter and a number';
