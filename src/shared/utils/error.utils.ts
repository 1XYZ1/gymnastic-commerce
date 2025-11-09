/**
 * Utilidades compartidas para manejo de errores
 *
 * Centraliza la lógica de transformación y manejo de errores de API
 * para mantener consistencia en toda la aplicación
 */

import { AxiosError } from 'axios';

/**
 * Interfaz para error de API estructurado
 */
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
}

/**
 * Mensajes de error genéricos en español
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet',
  UNAUTHORIZED: 'No tienes autorización para realizar esta acción',
  FORBIDDEN: 'Acceso denegado',
  NOT_FOUND: 'Recurso no encontrado',
  BAD_REQUEST: 'Solicitud inválida',
  SERVER_ERROR: 'Error del servidor. Intenta nuevamente',
  TIMEOUT: 'La solicitud tardó demasiado tiempo',
  UNKNOWN_ERROR: 'Error desconocido',
  VALIDATION_ERROR: 'Error de validación',
};

/**
 * Extrae un mensaje user-friendly desde un error de Axios
 */
export function getErrorMessage(error: unknown): string {
  // Si es un AxiosError
  if (error instanceof AxiosError) {
    // Error de red (sin respuesta del servidor)
    if (!error.response) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }

    // Error con mensaje custom del backend
    const apiError = error.response.data as ApiError;
    if (apiError?.message) {
      return apiError.message;
    }

    // Mensajes por código HTTP
    return getHttpErrorMessage(error.response.status);
  }

  // Error estándar de JavaScript
  if (error instanceof Error) {
    return error.message;
  }

  // Error desconocido
  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Retorna mensaje apropiado según código HTTP
 */
export function getHttpErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return ERROR_MESSAGES.BAD_REQUEST;
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 408:
      return ERROR_MESSAGES.TIMEOUT;
    case 500:
    case 502:
    case 503:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
}

/**
 * Determina si un error es recuperable (puede reintentar)
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    // Errores de red son recuperables
    if (!error.response) {
      return true;
    }

    const status = error.response.status;

    // 5xx son recuperables
    if (status >= 500 && status < 600) {
      return true;
    }

    // 408 (Request Timeout) es recuperable
    if (status === 408) {
      return true;
    }

    // 429 (Too Many Requests) es recuperable después de esperar
    if (status === 429) {
      return true;
    }
  }

  return false;
}

/**
 * Determina si un error requiere re-autenticación
 */
export function requiresAuth(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
}

/**
 * Determina si un error es de validación (400)
 */
export function isValidationError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 400;
  }
  return false;
}

/**
 * Determina si un error es de recurso no encontrado (404)
 */
export function isNotFoundError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 404;
  }
  return false;
}

/**
 * Extrae detalles completos del error para logging/debugging
 */
export function getErrorDetails(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    return {
      message: getErrorMessage(error),
      code: apiError?.code,
      statusCode: error.response?.status,
      details: apiError?.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      details: error.stack,
    };
  }

  return {
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
    details: error,
  };
}

/**
 * Loguea un error en consola con formato apropiado
 */
export function logError(error: unknown, context?: string): void {
  const details = getErrorDetails(error);
  const prefix = context ? `[${context}]` : '[Error]';

  console.error(`${prefix} ${details.message}`);

  if (details.statusCode) {
    console.error(`Status Code: ${details.statusCode}`);
  }

  if (details.code) {
    console.error(`Error Code: ${details.code}`);
  }

  if (details.details) {
    console.error('Details:', details.details);
  }
}

/**
 * Crea un objeto de error estructurado desde cualquier error
 */
export function createApiError(error: unknown): ApiError {
  return getErrorDetails(error);
}

/**
 * Wrapper para try-catch que maneja errores de forma consistente
 */
export async function handleAsync<T>(
  fn: () => Promise<T>,
  context?: string
): Promise<{ data?: T; error?: ApiError }> {
  try {
    const data = await fn();
    return { data };
  } catch (error) {
    if (context) {
      logError(error, context);
    }
    return { error: createApiError(error) };
  }
}

/**
 * Tipo para resultado de operación asíncrona
 */
export type AsyncResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Ejecuta una función asíncrona y retorna un resultado tipado
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  context?: string
): Promise<AsyncResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    if (context) {
      logError(error, context);
    }
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}
