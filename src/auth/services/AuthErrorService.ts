/**
 * Servicio para mapear errores de API a mensajes user-friendly
 *
 * NOTA: Este servicio se mantiene para compatibilidad con código existente,
 * pero ahora delega a las utilidades compartidas de error.utils
 */

import { getErrorMessage } from '@/shared/utils';
import { AxiosError } from 'axios';

export class AuthErrorService {
  /**
   * Convierte errores técnicos en mensajes amigables para el usuario
   * Delega a utilidades compartidas con lógica específica de autenticación
   */
  static getUserFriendlyMessage(error: unknown): string {
    // Errores específicos de autenticación
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      // 401: credenciales incorrectas
      if (status === 401) {
        return 'Correo o contraseña incorrectos';
      }

      // 409/400 con mensaje de email duplicado (registro)
      const errorData = error.response?.data as { message?: string };
      if (errorData?.message) {
        if (errorData.message.includes('duplicate') || errorData.message.includes('already exists')) {
          return 'Este correo electrónico ya está registrado. Intenta iniciar sesión.';
        }
        if (errorData.message.includes('Token expired')) {
          return 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
        }
      }
    }

    // Para otros errores, usar utilidad compartida
    return getErrorMessage(error);
  }
}
