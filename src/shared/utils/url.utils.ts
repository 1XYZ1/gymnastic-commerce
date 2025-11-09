/**
 * Utilidades compartidas para construcción de URLs de imágenes
 *
 * Centraliza la lógica de construcción de URLs para recursos estáticos
 * del backend, evitando duplicación en mappers
 */

/**
 * Obtiene la URL base del API desde variables de entorno
 */
export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
}

/**
 * Construye URL completa para imagen de producto
 */
export function buildProductImageUrl(filename: string): string {
  if (!filename) return '';

  // Si ya es una URL completa, retornarla
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  return `${getApiBaseUrl()}/files/product/${filename}`;
}

/**
 * Construye URL completa para imagen de servicio
 */
export function buildServiceImageUrl(filename: string): string {
  if (!filename) return '';

  // Si ya es una URL completa, retornarla
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  return `${getApiBaseUrl()}/files/service/${filename}`;
}

/**
 * Construye URL completa para imagen de mascota
 */
export function buildPetImageUrl(filename: string): string {
  if (!filename) return '';

  // Si ya es una URL completa, retornarla
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  return `${getApiBaseUrl()}/files/pet/${filename}`;
}

/**
 * Construye URL completa genérica para cualquier tipo de archivo
 */
export function buildFileUrl(type: 'product' | 'service' | 'pet', filename: string): string {
  if (!filename) return '';

  // Si ya es una URL completa, retornarla
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  return `${getApiBaseUrl()}/files/${type}/${filename}`;
}

/**
 * Convierte un array de nombres de archivo a URLs completas
 */
export function buildImageUrls(
  filenames: string[],
  type: 'product' | 'service' | 'pet'
): string[] {
  return filenames.map(filename => buildFileUrl(type, filename));
}

/**
 * Extrae el nombre del archivo desde una URL completa
 */
export function extractFilename(url: string): string {
  if (!url) return '';

  // Si no es una URL, asumir que ya es el nombre del archivo
  if (!url.includes('/')) return url;

  const parts = url.split('/');
  return parts[parts.length - 1];
}

/**
 * Valida si una URL es válida
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    // Si no es una URL completa, verificar que sea un path válido
    return url.length > 0 && !url.includes(' ');
  }
}
