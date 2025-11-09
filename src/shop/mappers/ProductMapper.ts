/**
 * Mapper para transformar datos de API a entidades de dominio
 *
 * Responsabilidad: Convertir DTOs de API en modelos de dominio,
 * agregando URLs completas a las imágenes usando utilidades compartidas
 */

import type { Product } from '@/shared/types';
import type { ProductsResponse } from '@/shared/types';
import { buildProductImageUrl } from '@/shared/utils';

export class ProductMapper {
  // baseUrl ya no se usa directamente, buildProductImageUrl lo obtiene de env
  constructor(_baseUrl: string) {
    // Constructor mantenido para compatibilidad con código existente
  }

  /**
   * Convierte un producto de API a producto de dominio
   * Agrega la URL base a las imágenes del producto usando buildProductImageUrl
   */
  toDomain(apiProduct: Product): Product {
    return {
      ...apiProduct,
      images: apiProduct.images.map((image) => buildProductImageUrl(image)),
    };
  }

  /**
   * Convierte una lista de productos de API a dominio
   */
  toDomainList(apiResponse: ProductsResponse): ProductsResponse {
    return {
      ...apiResponse,
      products: apiResponse.products.map((p) => this.toDomain(p)),
    };
  }
}
