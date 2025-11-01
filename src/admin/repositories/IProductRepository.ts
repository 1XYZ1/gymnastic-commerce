/**
 * Interface del repositorio de productos para Admin
 * Define el contrato para acceso a datos de productos desde el panel admin
 *
 * Siguiendo Dependency Inversion Principle:
 * Los hooks dependen de esta interfaz, no de la implementación concreta
 */

import type { Product } from '@/interfaces/product.interface';
import type { ProductsResponse } from '@/interfaces/products.response';
import type { ProductAdminFilter, ProductPayload } from '../types';

export interface IProductRepository {
  /**
   * Obtiene productos con filtros administrativos
   *
   * @param filter - Filtros a aplicar (más simples que en shop)
   * @returns Promise con la respuesta de productos
   */
  getProducts(filter?: ProductAdminFilter): Promise<ProductsResponse>;

  /**
   * Obtiene un producto por su ID
   *
   * @param id - ID del producto a buscar
   * @returns Promise con el producto encontrado
   * @throws Error si el producto no existe
   */
  getProductById(id: string): Promise<Product>;

  /**
   * Crea un nuevo producto
   *
   * @param product - Datos del producto a crear
   * @param files - Archivos de imagen a subir (opcional)
   * @returns Promise con el producto creado
   */
  createProduct(product: ProductPayload, files?: File[]): Promise<Product>;

  /**
   * Actualiza un producto existente
   *
   * @param id - ID del producto a actualizar
   * @param product - Datos actualizados del producto
   * @param files - Archivos de imagen a subir (opcional)
   * @returns Promise con el producto actualizado
   */
  updateProduct(
    id: string,
    product: ProductPayload,
    files?: File[]
  ): Promise<Product>;
}
