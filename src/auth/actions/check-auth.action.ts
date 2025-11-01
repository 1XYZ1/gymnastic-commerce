/**
 * Action de verificación de auth - Simplificada
 *
 * Ahora solo orquesta y delega al servicio
 */

import { authService } from '../repositories';
import type { AuthResponse } from '../types/auth.types';

export const checkAuthAction = async (): Promise<AuthResponse> => {
  const result = await authService.checkAuthStatus();

  if (!result.success) {
    throw new Error(result.error || 'Authentication check failed');
  }

  return {
    user: result.user!,
    token: result.token!,
  };
};
