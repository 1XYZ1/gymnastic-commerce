/**
 * Interface del repositorio de autenticación
 * Define el contrato para acceso a datos de auth
 *
 * Siguiendo Dependency Inversion Principle:
 * AuthService depende de esta interfaz, no de la implementación
 */

import type { AuthResponse } from '../types/auth.types';

export interface IAuthRepository {
  /**
   * Realiza login contra el backend
   */
  login(email: string, password: string): Promise<AuthResponse>;

  /**
   * Verifica el estado de autenticación actual
   */
  checkStatus(): Promise<AuthResponse>;

  // Futuro: register, resetPassword, refreshToken, etc.
}
