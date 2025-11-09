/**
 * Zustand store para estado de autenticación
 *
 * IMPORTANTE: Este store SOLO maneja estado.
 * Toda la lógica de negocio está delegada a AuthService.
 */

import { create } from 'zustand';
import type { User } from '@/shared/types';
import type { AuthStatus } from '../types/auth.types';
import { authService } from '../repositories';

type AuthState = {
  // Estado
  user: User | null;
  token: string | null;
  authStatus: AuthStatus;

  // Getters (estado derivado)
  isAdmin: () => boolean;

  // Acciones (solo coordinación + actualización de estado)
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Estado inicial
  user: null,
  token: null,
  authStatus: 'checking',

  // Getters
  isAdmin: () => {
    const user = get().user;
    return authService.isAdmin(user);
  },

  // Acciones - Simple coordinación entre service y estado
  login: async (email: string, password: string) => {
    const result = await authService.login(email, password);

    if (result.success) {
      set({
        user: result.user!,
        token: result.token!,
        authStatus: 'authenticated',
      });
      return true;
    } else {
      set({
        user: null,
        token: null,
        authStatus: 'not-authenticated',
      });
      return false;
    }
  },

  register: async (fullName: string, email: string, password: string) => {
    const result = await authService.register(fullName, email, password);

    if (result.success) {
      set({
        user: result.user!,
        token: result.token!,
        authStatus: 'authenticated',
      });
      return { success: true };
    } else {
      set({
        user: null,
        token: null,
        authStatus: 'not-authenticated',
      });
      return { success: false, error: result.error };
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, token: null, authStatus: 'not-authenticated' });
  },

  checkAuthStatus: async () => {
    const result = await authService.checkAuthStatus();

    if (result.success) {
      set({
        user: result.user!,
        token: result.token!,
        authStatus: 'authenticated',
      });
      return true;
    } else {
      set({
        user: null,
        token: null,
        authStatus: 'not-authenticated',
      });
      return false;
    }
  },
}));
