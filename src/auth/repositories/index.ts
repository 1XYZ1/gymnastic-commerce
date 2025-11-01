/**
 * Configuración de dependencias para el módulo auth
 */

import { gymApi } from '@/api/gymApi';
import { AuthApiRepository } from './AuthApiRepository';
import { AuthService } from '../services/AuthService';
import { TokenStorageService } from '../services/TokenStorageService';
import type { IAuthRepository } from './IAuthRepository';

// Instanciar servicios
const tokenStorage = new TokenStorageService();

// Instanciar repository
export const authRepository: IAuthRepository = new AuthApiRepository(gymApi);

// Instanciar y exportar auth service (singleton)
export const authService = new AuthService(authRepository, tokenStorage);

// Exportar tipos
export type { IAuthRepository } from './IAuthRepository';
