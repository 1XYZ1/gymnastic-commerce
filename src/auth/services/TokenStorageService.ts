/**
 * Servicio para gestionar el almacenamiento del token de autenticación
 *
 * Abstrae el acceso a localStorage para:
 * - Facilitar testing (mock del storage)
 * - Permitir cambiar implementación (sessionStorage, cookies, etc.)
 * - Centralizar la lógica de storage
 */

export class TokenStorageService {
  private readonly TOKEN_KEY = 'token';

  /**
   * Guarda el token en localStorage
   */
  save(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Obtiene el token desde localStorage
   * @returns El token o null si no existe
   */
  get(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Elimina el token de localStorage
   */
  remove(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Verifica si existe un token almacenado
   * @returns true si existe token, false en caso contrario
   */
  exists(): boolean {
    return this.get() !== null;
  }
}
