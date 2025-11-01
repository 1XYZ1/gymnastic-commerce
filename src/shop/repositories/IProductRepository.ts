/**
 * Interface del repositorio de productos
 * Define el contrato para acceso a datos de productos
 *
 * Siguiendo Dependency Inversion Principle:
 * Los hooks dependen de esta interfaz, no de la implementación concreta
 */

import type { ProductFilter } from '../types/product-filter.types';
import type { ProductsResponse } from '@/interfaces/products.response';

export interface IProductRepository {
  /**
   * Obtiene productos aplicando filtros
   *
   * @param filter - Filtros a aplicar en la búsqueda
   * @returns Promise con la respuesta de productos
   */
  getProducts(filter: ProductFilter): Promise<ProductsResponse>;
}
