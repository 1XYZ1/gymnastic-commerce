/**
 * Servicio de lógica de negocio del formulario de producto
 *
 * Responsabilidad: Transformaciones y validaciones de datos del formulario
 * Lógica pura sin dependencias de React
 */

import type { Product } from '@/interfaces/product.interface';
import type { ProductFormInputs, ProductPayload } from '../types';

export class ProductFormService {
  /**
   * Normaliza valores numéricos del formulario
   * Convierte strings a números cuando sea necesario
   *
   * @param data - Datos del formulario con posibles strings
   * @returns Datos con números normalizados
   */
  static normalizeNumbers<T extends Record<string, unknown>>(data: T): T {
    const normalized = { ...data } as Record<string, unknown>;

    // Convertir price a número si existe
    if ('price' in normalized && normalized.price !== undefined) {
      normalized.price = Number(normalized.price) || 0;
    }

    // Convertir stock a número si existe
    if ('stock' in normalized && normalized.stock !== undefined) {
      normalized.stock = Number(normalized.stock) || 0;
    }

    return normalized as T;
  }

  /**
   * Prepara los datos del formulario para enviar al API
   * Elimina campos innecesarios y normaliza valores
   *
   * @param formData - Datos del formulario
   * @returns Objeto preparado para el API
   */
  static prepareProductData(
    formData: ProductFormInputs
  ): Omit<ProductPayload, 'images'> {
    // Extraer campos que no deben enviarse al API
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { files, images, ...productData } = formData;

    // Normalizar números
    const normalized = this.normalizeNumbers(productData);

    return normalized as Omit<ProductPayload, 'images'>;
  }

  /**
   * Genera un slug válido a partir de un título
   * Convierte "Mi Producto 123" en "mi-producto-123"
   *
   * @param title - Título del producto
   * @returns Slug válido para URL
   */
  static generateSlugFromTitle(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-'); // Eliminar guiones duplicados
  }

  /**
   * Valida que el slug no contenga espacios ni caracteres inválidos
   *
   * @param slug - Slug a validar
   * @returns true si es válido, mensaje de error si no
   */
  static validateSlug(slug: string): true | string {
    if (/\s/.test(slug)) {
      return 'El slug no puede contener espacios en blanco';
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return 'El slug solo puede contener letras minúsculas, números y guiones';
    }

    return true;
  }

  /**
   * Crea un objeto Product vacío para nuevos productos
   *
   * @returns Product con valores por defecto
   */
  static createEmptyProduct(): Partial<Product> {
    return {
      id: 'new',
      title: '',
      price: 0,
      description: '',
      slug: '',
      stock: 0,
      sizes: [],
      gender: 'men',
      tags: [],
      images: [],
    };
  }
}
