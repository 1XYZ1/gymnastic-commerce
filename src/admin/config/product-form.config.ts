/**
 * Configuración del formulario de productos
 *
 * Contiene todas las constantes y configuraciones relacionadas
 * con el formulario de creación/edición de productos
 */

import type { Size, Category } from '@/shared/types';

/**
 * Tallas disponibles para productos
 */
export const AVAILABLE_SIZES: readonly Size[] = [
  '500g',
  '1kg',
  '3kg',
  '7kg',
  '15kg',
  '20kg',
  'S',
  'M',
  'L',
  'XL',
] as const;

/**
 * Opciones de categoría para el selector
 */
export const CATEGORY_OPTIONS: ReadonlyArray<{
  value: Category;
  label: string;
}> = [
  { value: 'dogs', label: 'Para Perros' },
  { value: 'cats', label: 'Para Gatos' },
] as const;

/**
 * Configuración de subida de archivos
 */
export const FILE_UPLOAD_CONFIG = {
  maxSizePerFile: 10 * 1024 * 1024, // 10MB
  acceptedTypes: 'image/*',
  maxFiles: 10,
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
} as const;

/**
 * Mensajes de validación del formulario
 */
export const VALIDATION_MESSAGES = {
  title: {
    required: 'El título es requerido',
    minLength: 'El título debe tener al menos 3 caracteres',
  },
  price: {
    required: 'El precio es requerido',
    min: 'El precio debe ser mayor a 0',
  },
  stock: {
    required: 'El stock es requerido',
    min: 'El inventario debe ser mayor a 0',
  },
  slug: {
    required: 'El slug es requerido',
    pattern: 'El slug no puede contener espacios en blanco',
    invalid: 'El slug solo puede contener letras minúsculas, números y guiones',
  },
  description: {
    required: 'La descripción es requerida',
    minLength: 'La descripción debe tener al menos 10 caracteres',
  },
  images: {
    required: 'Debe agregar al menos una imagen',
    maxFiles: 'No puede agregar más de 10 imágenes',
  },
} as const;

/**
 * Configuración de React Query para productos
 */
export const PRODUCT_QUERY_CONFIG = {
  staleTime: 1000 * 60 * 5, // 5 minutos
  cacheTime: 1000 * 60 * 10, // 10 minutos
  retry: 2,
} as const;
