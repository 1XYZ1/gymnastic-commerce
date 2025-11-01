/**
 * Servicio de transformación de imágenes
 *
 * Responsabilidad: Lógica de negocio pura para manipulación de URLs
 * y nombres de imágenes de productos
 */

/**
 * Prepara las imágenes para subir al servidor
 * Combina imágenes existentes con nuevas subidas
 *
 * @param existingImages - URLs de imágenes ya existentes
 * @param uploadedFileNames - Nombres de archivos recién subidos
 * @returns Array con todos los nombres de imágenes
 */
export class ImageTransformService {
  /**
   * Extrae los nombres de archivo de URLs completas
   * Convierte "http://domain.com/files/product/image.jpg" en "image.jpg"
   *
   * @param images - Array de URLs de imágenes
   * @returns Array de nombres de archivo
   */
  static extractImageNames(images: string[]): string[] {
    return images.map((image) => {
      if (image.includes('http')) {
        return image.split('/').pop() || '';
      }
      return image;
    });
  }

  /**
   * Añade la URL base a nombres de archivo
   * Convierte "image.jpg" en "http://domain.com/files/product/image.jpg"
   *
   * @param images - Array de nombres de archivo
   * @param baseUrl - URL base del servidor
   * @returns Array de URLs completas
   */
  static addFullUrlToImages(images: string[], baseUrl: string): string[] {
    return images.map((image) => {
      if (image.includes('http')) {
        return image;
      }
      return `${baseUrl}/files/product/${image}`;
    });
  }

  /**
   * Prepara el array final de imágenes combinando existentes y nuevas
   *
   * @param existingImages - Imágenes ya existentes en el producto
   * @param uploadedFileNames - Nombres de archivos recién subidos
   * @returns Array con todos los nombres para enviar al API
   */
  static prepareImagesForUpload(
    existingImages: string[],
    uploadedFileNames: string[]
  ): string[] {
    // Extraer nombres de las imágenes existentes
    const existingNames = this.extractImageNames(existingImages);

    // Combinar con las nuevas
    return [...existingNames, ...uploadedFileNames];
  }
}
