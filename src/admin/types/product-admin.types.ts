/**
 * Tipos de dominio para la administración de productos
 *
 * Estos tipos representan los conceptos de negocio del módulo Admin
 * relacionados con la gestión de productos
 */

import type { Size, Gender, Product } from '@/shared/types';

/**
 * Datos del formulario de producto
 * Representa la entrada del usuario en el formulario de creación/edición
 */
export interface ProductFormInputs {
  id?: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  slug: string;
  gender: Gender;
  sizes: Size[];
  tags: string[];
  images: string[];
  files?: File[];
}

/**
 * Filtro para búsqueda de productos en el admin
 * Versión simplificada para el listado administrativo
 */
export interface ProductAdminFilter {
  limit?: number;
  offset?: number;
  query?: string;
}

/**
 * Resultado de subida de archivos
 */
export interface FileUploadResult {
  fileName: string;
  secureUrl: string;
}

/**
 * Datos preparados para enviar al API
 * Producto con imágenes transformadas y validaciones aplicadas
 */
export interface ProductPayload extends Partial<Product> {
  images: string[];
}
