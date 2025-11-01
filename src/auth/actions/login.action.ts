/**
 * Action de login - Simplificada
 *
 * Ahora solo orquesta y delega al servicio
 */

import { authService } from '../repositories';
import type { AuthResponse } from '../types/auth.types';

export const loginAction = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const result = await authService.login(email, password);

  if (!result.success) {
    throw new Error(result.error || 'Login failed');
  }

  return {
    user: result.user!,
    token: result.token!,
  };
};
