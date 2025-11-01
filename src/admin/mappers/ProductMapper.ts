/**
 * Mapper para transformación de datos de productos
 *
 * Responsabilidad: Convertir entre representaciones de dominio y API
 * - toDomain: API → Dominio (agrega URLs completas)
 * - toApi: Dominio → API (extrae solo nombres de archivo)
 */

import type { Product } from '@/interfaces/product.interface';
import { ImageTransformService } from '../services';

export class ProductMapper {
  /**
   * Transforma un producto de la API al formato de dominio
   * Agrega URLs completas a las imágenes
   *
   * @param apiProduct - Producto recibido desde la API
   * @param baseUrl - URL base del servidor
   * @returns Producto con URLs completas en imágenes
   */
  static toDomain(apiProduct: Product, baseUrl: string): Product {
    return {
      ...apiProduct,
      images: ImageTransformService.addFullUrlToImages(
        apiProduct.images,
        baseUrl
      ),
    };
  }

  /**
   * Transforma un producto de dominio al formato API
   * Extrae solo los nombres de archivo de las imágenes
   *
   * @param domainProduct - Producto en formato de dominio
   * @returns Producto con solo nombres de archivo en imágenes
   */
  static toApi(domainProduct: Partial<Product>): Partial<Product> {
    if (!domainProduct.images) {
      return domainProduct;
    }

    return {
      ...domainProduct,
      images: ImageTransformService.extractImageNames(domainProduct.images),
    };
  }

  /**
   * Transforma una lista de productos de la API al formato de dominio
   *
   * @param apiProducts - Lista de productos desde la API
   * @param baseUrl - URL base del servidor
   * @returns Lista de productos con URLs completas
   */
  static toDomainList(apiProducts: Product[], baseUrl: string): Product[] {
    return apiProducts.map((product) => this.toDomain(product, baseUrl));
  }
}
