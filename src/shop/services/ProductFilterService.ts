/**
 * Servicio de dominio para lógica de negocio relacionada con filtros de productos
 *
 * Este servicio contiene lógica pura (sin dependencias de framework)
 * que puede ser fácilmente testeada de manera unitaria
 */

import { PRODUCTS_CONFIG } from '@/config/products.config';
import type { PriceRange } from '../types/product-filter.types';

export class ProductFilterService {
  /**
   * Convierte una clave de rango de precio en valores min/max
   *
   * @param priceKey - Clave del rango de precio (ej: "0-50", "50-100")
   * @returns Objeto con valores min y max, o vacío para "any"
   *
   * @example
   * parsePriceRange("0-50") // { min: 0, max: 50 }
   * parsePriceRange("any")  // {}
   */
  static parsePriceRange(priceKey: string): PriceRange {
    const priceRanges = PRODUCTS_CONFIG.priceRanges;
    return priceRanges[priceKey as keyof typeof priceRanges] ?? {};
  }

  /**
   * Calcula el offset de paginación basado en el número de página
   *
   * @param page - Número de página (base 1)
   * @param limit - Cantidad de items por página
   * @returns Objeto con offset y limit calculados
   *
   * @example
   * calculatePagination(1, 10) // { offset: 0, limit: 10 }
   * calculatePagination(3, 10) // { offset: 20, limit: 10 }
   */
  static calculatePagination(page: number, limit: number) {
    return {
      offset: (page - 1) * limit,
      limit,
    };
  }

  /**
   * Parsea un parámetro numérico con valor por defecto
   * Maneja valores null, undefined, y strings no numéricos
   *
   * @param value - Valor a parsear (puede ser string, null, undefined)
   * @param defaultValue - Valor por defecto si el parsing falla
   * @returns Número parseado o valor por defecto
   *
   * @example
   * parseNumericParam("10", 9)    // 10
   * parseNumericParam(null, 9)    // 9
   * parseNumericParam("abc", 9)   // 9
   */
  static parseNumericParam(value: string | null, defaultValue: number): number {
    if (!value) return defaultValue;
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
}
