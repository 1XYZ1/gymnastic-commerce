/**
 * Configuración de dependencias para el módulo auth
 * Modificado para usar inicialización lazy y evitar errores de inicialización circular
 */

import { gymApi } from '@/api/gymApi';
import { AuthApiRepository } from './AuthApiRepository';
import { AuthService } from '../services/AuthService';
import { tokenStorage } from '../services/TokenStorageService';
import type { IAuthRepository } from './IAuthRepository';

// Variables privadas para singletons
let _authRepository: IAuthRepository | undefined;
let _authService: AuthService | undefined;

// Función helper para obtener el repository (singleton)
const getRepository = (): IAuthRepository => {
  if (!_authRepository) {
    _authRepository = new AuthApiRepository(gymApi);
  }
  return _authRepository;
};

// Función helper para obtener el service (singleton)
const getService = (): AuthService => {
  if (!_authService) {
    _authService = new AuthService(getRepository(), tokenStorage);
  }
  return _authService;
};

// Exportar las funciones getter para lazy initialization
// Esto asegura que la inicialización ocurra cuando se usen, no cuando se importen
export const getAuthRepository = getRepository;
export const getAuthService = getService;

// Exportar tipos
export type { IAuthRepository } from './IAuthRepository';
