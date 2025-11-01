/**
 * Servicio de dominio para lógica de autenticación
 *
 * Responsabilidades:
 * - Coordinar login/logout/checkAuth
 * - Gestionar token storage
 * - Manejar errores de autenticación
 * - Validar reglas de negocio (ej: isAdmin)
 */

import type { IAuthRepository } from '../repositories/IAuthRepository';
import { TokenStorageService } from './TokenStorageService';
import { AuthErrorService } from './AuthErrorService';
import type { User } from '@/interfaces/user.interface';

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export class AuthService {
  private repository: IAuthRepository;
  private tokenStorage: TokenStorageService;

  constructor(
    repository: IAuthRepository,
    tokenStorage: TokenStorageService
  ) {
    this.repository = repository;
    this.tokenStorage = tokenStorage;
  }

  /**
   * Realiza login de usuario
   * @returns AuthResult con success, user y token si exitoso
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const response = await this.repository.login(email, password);
      this.tokenStorage.save(response.token);

      return {
        success: true,
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      this.tokenStorage.remove();
      return {
        success: false,
        error: AuthErrorService.getUserFriendlyMessage(error),
      };
    }
  }

  /**
   * Cierra sesión del usuario
   */
  logout(): void {
    this.tokenStorage.remove();
  }

  /**
   * Verifica el estado de autenticación actual
   * @returns AuthResult con el estado actualizado
   */
  async checkAuthStatus(): Promise<AuthResult> {
    if (!this.tokenStorage.exists()) {
      return { success: false, error: 'No token found' };
    }

    try {
      const response = await this.repository.checkStatus();
      this.tokenStorage.save(response.token);

      return {
        success: true,
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      this.tokenStorage.remove();
      return {
        success: false,
        error: 'Token expired or invalid',
      };
    }
  }

  /**
   * Verifica si un usuario tiene rol de administrador
   */
  isAdmin(user: User | null): boolean {
    if (!user) return false;
    return user.roles.includes('admin');
  }
}
