/**
 * Configuración centralizada para la gestión de productos
 *
 * Define constantes para paginación, caché, y rangos de precios
 * utilizados en los filtros de productos
 */

export const PRODUCTS_CONFIG = {
  pagination: {
    defaultLimit: 9,
    defaultPage: 1,
  },
  cache: {
    // Tiempo en milisegundos que los datos se consideran frescos (5 minutos)
    staleTime: 5 * 60 * 1000,
  },
  priceRanges: {
    'any': {},
    '0-50': { min: 0, max: 50 },
    '50-100': { min: 50, max: 100 },
    '100-200': { min: 100, max: 200 },
    '200+': { min: 200 },
  },
} as const;

// Tipos derivados de la configuración para mayor seguridad de tipos
export type PriceRangeKey = keyof typeof PRODUCTS_CONFIG.priceRanges;
