/**
 * CartErrorService - Error handling and transformation
 *
 * Responsabilidad: Transformar errores de API a mensajes user-friendly
 * Delega a utilidades compartidas con lógica específica del carrito
 */

import { AxiosError } from 'axios';
import { CART_ERROR_MESSAGES } from '../config/cart.config';
import type { CartError } from '../types/cart.types';
import { getErrorMessage as getSharedErrorMessage, isRetryableError, requiresAuth } from '@/shared/utils';

export class CartErrorService {
  /**
   * Transforma un error de Axios a un mensaje user-friendly
   * Usa utilidades compartidas con lógica específica del carrito
   */
  static getErrorMessage(error: unknown): string {
    // Si es un AxiosError, manejar errores específicos del carrito
    if (error instanceof AxiosError) {
      // Error de red - usar mensaje del config
      if (!error.response) {
        return CART_ERROR_MESSAGES.NETWORK_ERROR;
      }

      const apiError = error.response.data as CartError;
      const status = error.response.status;

      // Errores específicos del carrito
      if (status === 400) {
        return this.handle400Error(apiError);
      }

      if (status === 401) {
        return 'Debes iniciar sesión para usar el carrito';
      }

      if (status === 404) {
        return 'Producto no encontrado';
      }

      if (status === 409) {
        return 'Conflicto con el estado del carrito';
      }

      // Si hay mensaje custom del backend, usarlo
      if (apiError?.message) {
        return apiError.message;
      }
    }

    // Para otros errores, usar utilidad compartida
    return getSharedErrorMessage(error);
  }

  /**
   * Maneja errores 400 (Bad Request) específicos
   */
  private static handle400Error(apiError: CartError): string {
    const code = apiError?.code?.toLowerCase();

    if (!code) {
      return 'Solicitud inválida';
    }

    if (code.includes('stock')) {
      return CART_ERROR_MESSAGES.OUT_OF_STOCK;
    }

    if (code.includes('quantity')) {
      return CART_ERROR_MESSAGES.MAX_QUANTITY_EXCEEDED;
    }

    if (code.includes('size')) {
      return CART_ERROR_MESSAGES.INVALID_SIZE;
    }

    return apiError.message || 'Solicitud inválida';
  }

  /**
   * Determina si un error es recuperable (puede reintentar)
   * Delega a utilidad compartida
   */
  static isRetryable(error: unknown): boolean {
    return isRetryableError(error);
  }

  /**
   * Determina si un error requiere re-autenticación
   * Delega a utilidad compartida
   */
  static requiresAuth(error: unknown): boolean {
    return requiresAuth(error);
  }

  /**
   * Extrae información adicional del error para logging
   */
  static getErrorDetails(error: unknown): {
    message: string;
    code?: string;
    statusCode?: number;
    stack?: string;
  } {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data as CartError;
      return {
        message: this.getErrorMessage(error),
        code: apiError?.code,
        statusCode: error.response?.status,
        stack: error.stack,
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack,
      };
    }

    return {
      message: 'Unknown error',
    };
  }
}
