/**
 * Tipos de dominio para el módulo de autenticación
 */

import type { User } from '@/interfaces/user.interface';

/**
 * Respuesta de login y check-status desde la API
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Estados posibles de autenticación
 */
export type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

/**
 * Credenciales de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Datos para registro (futuro)
 */
export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword: string;
}
