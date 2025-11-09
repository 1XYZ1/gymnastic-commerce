/**
 * Implementación del repositorio de auth usando API REST
 *
 * Responsabilidad: Comunicarse con la API de autenticación
 */

import type { AxiosInstance } from 'axios';
import { AxiosError } from 'axios';
import type { IAuthRepository } from './IAuthRepository';
import type { AuthResponse } from '../types/auth.types';
import { getErrorMessage, logError } from '@/shared/utils/error.utils';

export class AuthApiRepository implements IAuthRepository {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data } = await this.api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      return data;
    } catch (error) {
      // Logging para debugging
      logError(error, 'AuthRepository.login');

      // Mensajes específicos de error de login
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const apiMessage = error.response?.data?.message;

        if (status === 401) {
          throw new Error(apiMessage || 'Credenciales incorrectas');
        }
        if (status === 400) {
          throw new Error(apiMessage || 'Email o contraseña inválidos');
        }
        if (status === 403) {
          throw new Error('Tu cuenta ha sido desactivada');
        }
      }

      // Mensaje genérico user-friendly
      throw new Error(getErrorMessage(error));
    }
  }

  async register(fullName: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const { data } = await this.api.post<AuthResponse>('/auth/register', {
        fullName,
        email,
        password,
      });
      return data;
    } catch (error) {
      // Logging para debugging
      logError(error, 'AuthRepository.register');

      // Mensajes específicos de error de registro
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const apiMessage = error.response?.data?.message;

        if (status === 400) {
          // El backend puede enviar mensajes específicos (email duplicado, etc.)
          throw new Error(apiMessage || 'Datos de registro inválidos');
        }
        if (status === 409) {
          throw new Error('Este email ya está registrado');
        }
      }

      // Mensaje genérico user-friendly
      throw new Error(getErrorMessage(error));
    }
  }

  async checkStatus(): Promise<AuthResponse> {
    try {
      const { data } = await this.api.get<AuthResponse>('/auth/check-status');
      return data;
    } catch (error) {
      // Logging para debugging
      logError(error, 'AuthRepository.checkStatus');

      // Mensajes específicos de error de verificación
      if (error instanceof AxiosError) {
        const status = error.response?.status;

        if (status === 401) {
          throw new Error('Tu sesión ha expirado');
        }
        if (status === 403) {
          throw new Error('Acceso no autorizado');
        }
      }

      // Mensaje genérico user-friendly
      throw new Error(getErrorMessage(error));
    }
  }
}
