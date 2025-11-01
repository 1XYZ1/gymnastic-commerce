/**
 * Mapper para transformar datos de API a entidades de dominio
 *
 * Responsabilidad: Convertir DTOs de API en modelos de dominio,
 * agregando URLs completas a las imágenes
 */

import type { Product } from '@/shared/types';
import type { ProductsResponse } from '@/shared/types';

export class ProductMapper {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Convierte un producto de API a producto de dominio
   * Agrega la URL base a las imágenes del producto
   */
  toDomain(apiProduct: Product): Product {
    return {
      ...apiProduct,
      images: apiProduct.images.map(
        (image) => `${this.baseUrl}/files/product/${image}`
      ),
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
