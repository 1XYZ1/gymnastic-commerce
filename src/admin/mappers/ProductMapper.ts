/**
 * Mapper para transformación de datos de productos
 *
 * Responsabilidad: Convertir entre representaciones de dominio y API
 * - toDomain: API → Dominio (agrega URLs completas)
 * - toApi: Dominio → API (extrae solo nombres de archivo)
 */

import type { Product } from '@/shared/types';
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
   * Solo envía los campos específicos que el backend espera
   *
   * @param domainProduct - Producto en formato de dominio
   * @returns Producto con solo los campos necesarios para el API
   */
  static toApi(domainProduct: Partial<Product>): Record<string, any> {
    // Solo incluir los campos que el backend espera en UpdateProductDto
    const payload: Record<string, any> = {};

    // Campos opcionales - solo incluir si existen
    if (domainProduct.title !== undefined) payload.title = domainProduct.title;
    if (domainProduct.description !== undefined) payload.description = domainProduct.description;
    if (domainProduct.price !== undefined) payload.price = Number(domainProduct.price);
    if (domainProduct.stock !== undefined) payload.stock = Number(domainProduct.stock);
    if (domainProduct.slug !== undefined) payload.slug = domainProduct.slug;
    if (domainProduct.species !== undefined) payload.species = domainProduct.species === 'none' ? null : domainProduct.species;
    if (domainProduct.sizes !== undefined) payload.sizes = domainProduct.sizes;
    if (domainProduct.tags !== undefined) payload.tags = domainProduct.tags;
    if (domainProduct.type !== undefined) payload.type = domainProduct.type;

    // Imágenes - extraer solo nombres de archivo
    if (domainProduct.images !== undefined) {
      payload.images = ImageTransformService.extractImageNames(domainProduct.images);
    }

    return payload;
  }
}
