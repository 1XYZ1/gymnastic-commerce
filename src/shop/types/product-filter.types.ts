/**
 * Tipos de dominio para filtros de productos
 *
 * Estos tipos representan los conceptos de negocio relacionados
 * con el filtrado y búsqueda de productos en la tienda
 */

/**
 * Clave para identificar rangos de precio predefinidos
 */
export type PriceRangeKey = 'any' | '0-50' | '50-100' | '100-200' | '200+';

/**
 * Rango de precios con valores mínimo y máximo
 */
export interface PriceRange {
  readonly min?: number;
  readonly max?: number;
}

/**
 * Filtro completo para búsqueda de productos
 * Utilizado por el repositorio para obtener productos filtrados
 */
export interface ProductFilter {
  readonly limit: number;
  readonly offset: number;
  readonly query?: string;
  readonly sizes?: string;
  readonly gender?: string;
  readonly minPrice?: number;
  readonly maxPrice?: number;
}
