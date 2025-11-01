/**
 * Implementación del repositorio de auth usando API REST
 *
 * Responsabilidad: Comunicarse con la API de autenticación
 */

import type { AxiosInstance } from 'axios';
import type { IAuthRepository } from './IAuthRepository';
import type { AuthResponse } from '../types/auth.types';

export class AuthApiRepository implements IAuthRepository {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await this.api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return data;
  }

  async checkStatus(): Promise<AuthResponse> {
    const { data } = await this.api.get<AuthResponse>('/auth/check-status');
    return data;
  }
}
