/**
 * Singleton compartido del ProductMapper
 *
 * Este singleton asegura consistencia en la transformación de URLs de imágenes
 * a lo largo de toda la aplicación, evitando inconsistencias entre diferentes
 * instancias del mapper.
 *
 * @module shared/mappers
 */

import { ProductMapper } from '@/shop/mappers/ProductMapper';

/**
 * Singleton compartido del ProductMapper para asegurar consistencia
 * en la transformación de URLs de imágenes a lo largo de toda la aplicación
 */
export const sharedProductMapper = new ProductMapper(
  import.meta.env.VITE_API_URL || ''
);
