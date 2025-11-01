/**
 * Servicio para mapear errores de API a mensajes user-friendly
 */

export class AuthErrorService {
  /**
   * Convierte errores técnicos en mensajes amigables para el usuario
   */
  static getUserFriendlyMessage(error: unknown): string {
    if (error instanceof Error) {
      // Errores comunes de autenticación
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return 'Correo o contraseña incorrectos';
      }

      if (error.message.includes('403') || error.message.includes('Forbidden')) {
        return 'No tienes permisos para acceder';
      }

      if (error.message.includes('network') || error.message.includes('Network')) {
        return 'Error de conexión. Verifica tu internet.';
      }

      if (error.message.includes('timeout')) {
        return 'La solicitud tardó demasiado. Intenta de nuevo.';
      }

      if (error.message.includes('Token expired')) {
        return 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
      }
    }

    return 'Ocurrió un error inesperado. Intenta de nuevo.';
  }
}
