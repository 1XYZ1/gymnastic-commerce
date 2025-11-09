/**
 * Servicio global para manejo centralizado de errores
 *
 * Responsabilidades:
 * - Logging de errores
 * - Categorización de errores
 * - Notificaciones de error
 * - Tracking de errores (para futura integración con Sentry, LogRocket, etc.)
 */

import { toast } from 'sonner';
import {
  getErrorMessage,
  getErrorDetails,
  logError,
  requiresAuth,
  isRetryableError,
  type ApiError
} from '../utils/error.utils';

/**
 * Severidad del error para logging y notificaciones
 */
export const ErrorSeverity = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
} as const;

export type ErrorSeverity = typeof ErrorSeverity[keyof typeof ErrorSeverity];

/**
 * Opciones para manejo de errores
 */
export interface ErrorHandlerOptions {
  /** Mostrar toast notification al usuario */
  showToast?: boolean;
  /** Severidad del error */
  severity?: ErrorSeverity;
  /** Contexto adicional (ej: nombre del componente, operación) */
  context?: string;
  /** Mensaje custom para el usuario */
  customMessage?: string;
  /** Callback para ejecutar después de manejar el error */
  onError?: (error: ApiError) => void;
  /** Acción custom para mostrar en el toast */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Servicio global para manejo de errores
 */
export class GlobalErrorService {
  private static errorHistory: Array<{
    error: ApiError;
    timestamp: Date;
    context?: string;
  }> = [];

  /**
   * Maneja un error de forma centralizada
   */
  static handleError(error: unknown, options: ErrorHandlerOptions = {}): void {
    const {
      showToast = true,
      severity = ErrorSeverity.ERROR,
      context,
      customMessage,
      onError,
      action,
    } = options;

    // Extraer detalles del error
    const errorDetails = getErrorDetails(error);
    const message = customMessage || getErrorMessage(error);

    // Logging del error
    if (context) {
      logError(error, context);
    } else {
      console.error('[GlobalErrorService]', errorDetails);
    }

    // Guardar en historial (para debugging)
    this.addToHistory(errorDetails, context);

    // Mostrar notificación al usuario
    if (showToast) {
      this.showErrorToast(message, severity, action);
    }

    // Callback personalizado
    if (onError) {
      onError(errorDetails);
    }

    // Si requiere re-autenticación, redirigir a login
    if (requiresAuth(error)) {
      this.handleAuthError();
    }
  }

  /**
   * Maneja un error de autenticación (401)
   */
  private static handleAuthError(): void {
    // Limpiar token y redirigir a login
    localStorage.removeItem('token');

    // Retrasar redirección para que el usuario vea el mensaje
    setTimeout(() => {
      window.location.href = '/auth/login';
    }, 1500);
  }

  /**
   * Muestra un toast notification según la severidad
   */
  private static showErrorToast(
    message: string,
    severity: ErrorSeverity,
    action?: { label: string; onClick: () => void }
  ): void {
    const toastOptions = action
      ? {
          action: {
            label: action.label,
            onClick: action.onClick,
          },
        }
      : undefined;

    switch (severity) {
      case ErrorSeverity.INFO:
        toast.info(message, toastOptions);
        break;
      case ErrorSeverity.WARNING:
        toast.warning(message, toastOptions);
        break;
      case ErrorSeverity.ERROR:
        toast.error(message, toastOptions);
        break;
      case ErrorSeverity.CRITICAL:
        toast.error(message, {
          ...toastOptions,
          duration: 10000, // Más tiempo para errores críticos
        });
        break;
    }
  }

  /**
   * Agrega error al historial para debugging
   */
  private static addToHistory(error: ApiError, context?: string): void {
    this.errorHistory.push({
      error,
      timestamp: new Date(),
      context,
    });

    // Mantener solo los últimos 50 errores
    if (this.errorHistory.length > 50) {
      this.errorHistory.shift();
    }
  }

  /**
   * Obtiene el historial de errores (útil para debugging)
   */
  static getErrorHistory(): typeof GlobalErrorService.errorHistory {
    return [...this.errorHistory];
  }

  /**
   * Limpia el historial de errores
   */
  static clearHistory(): void {
    this.errorHistory = [];
  }

  /**
   * Determina si un error es crítico y requiere atención inmediata
   */
  static isCriticalError(error: unknown): boolean {
    const details = getErrorDetails(error);

    // Errores 5xx son críticos
    if (details.statusCode && details.statusCode >= 500) {
      return true;
    }

    // Errores de autenticación son críticos si el usuario estaba autenticado
    if (requiresAuth(error)) {
      return true;
    }

    return false;
  }

  /**
   * Determina si mostrar opción de reintento
   */
  static shouldShowRetry(error: unknown): boolean {
    return isRetryableError(error);
  }

  /**
   * Maneja errores de validación de formularios
   */
  static handleValidationError(
    error: unknown,
    formFieldErrors?: Record<string, string>
  ): void {
    const message = getErrorMessage(error);

    // Si hay errores de campos específicos, no mostrar toast general
    if (formFieldErrors && Object.keys(formFieldErrors).length > 0) {
      console.warn('[ValidationError]', formFieldErrors);
      return;
    }

    // Mostrar toast con el mensaje de validación
    toast.error(message, {
      description: 'Revisa los datos ingresados',
    });
  }

  /**
   * Maneja errores de conexión
   */
  static handleNetworkError(): void {
    toast.error('Sin conexión a internet', {
      description: 'Verifica tu conexión e intenta nuevamente',
      action: {
        label: 'Reintentar',
        onClick: () => window.location.reload(),
      },
    });
  }

  /**
   * Maneja errores de timeout
   */
  static handleTimeoutError(): void {
    toast.error('La solicitud tardó demasiado', {
      description: 'Por favor, intenta nuevamente',
      action: {
        label: 'Reintentar',
        onClick: () => window.location.reload(),
      },
    });
  }

  /**
   * Wrapper para operaciones async con manejo de errores automático
   */
  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error, options);
      return null;
    }
  }
}
