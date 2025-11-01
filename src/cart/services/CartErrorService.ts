/**
 * CartErrorService - Error handling and transformation
 *
 * Responsabilidad: Transformar errores de API a mensajes user-friendly
 */

import { AxiosError } from 'axios';
import { CART_ERROR_MESSAGES } from '../config/cart.config';
import type { CartError } from '../types/cart.types';

export class CartErrorService {
  /**
   * Transforma un error de Axios a un mensaje user-friendly
   */
  static getErrorMessage(error: unknown): string {
    // Si es un AxiosError
    if (error instanceof AxiosError) {
      // Error de red
      if (!error.response) {
        return CART_ERROR_MESSAGES.NETWORK_ERROR;
      }

      // Error de la API con mensaje custom
      const apiError = error.response.data as CartError;
      if (apiError?.message) {
        return apiError.message;
      }

      // Errores HTTP específicos
      switch (error.response.status) {
        case 400:
          return this.handle400Error(apiError);
        case 401:
          return 'Debes iniciar sesión para usar el carrito';
        case 404:
          return 'Producto no encontrado';
        case 409:
          return 'Conflicto con el estado del carrito';
        case 500:
          return 'Error del servidor. Intenta nuevamente';
        default:
          return CART_ERROR_MESSAGES.FETCH_ERROR;
      }
    }

    // Error genérico
    if (error instanceof Error) {
      return error.message;
    }

    return 'Error desconocido';
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
   */
  static isRetryable(error: unknown): boolean {
    if (error instanceof AxiosError) {
      // Errores de red son recuperables
      if (!error.response) {
        return true;
      }

      // 5xx son recuperables
      if (error.response.status >= 500) {
        return true;
      }

      // 408 (Request Timeout) es recuperable
      if (error.response.status === 408) {
        return true;
      }
    }

    return false;
  }

  /**
   * Determina si un error requiere re-autenticación
   */
  static requiresAuth(error: unknown): boolean {
    if (error instanceof AxiosError) {
      return error.response?.status === 401;
    }
    return false;
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
