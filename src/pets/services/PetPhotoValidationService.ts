/**
 * Resultado de validación de imagen
 */
export interface ImageValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Servicio de validación de fotos de perfil de mascotas
 *
 * Valida solo:
 * - Tipos aceptados: jpg, jpeg, png, gif
 * - Tamaño máximo: 5MB
 */
export class PetPhotoValidationService {
  // Configuración de validación
  private static readonly ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  /**
   * Valida el tipo de archivo
   */
  static validateFileType(file: File): boolean {
    return this.ACCEPTED_TYPES.includes(file.type);
  }

  /**
   * Valida el tamaño del archivo
   */
  static validateFileSize(file: File): boolean {
    return file.size <= this.MAX_FILE_SIZE;
  }

  /**
   * Valida una imagen
   * Solo valida tipo y tamaño, cualquier imagen que pase estas validaciones es aceptada
   */
  static async validateImage(file: File): Promise<ImageValidationResult> {
    const errors: string[] = [];

    // Validar tipo de archivo
    if (!this.validateFileType(file)) {
      errors.push(
        'Tipo de archivo no válido. Solo se aceptan: JPG, JPEG, PNG, GIF'
      );
    }

    // Validar tamaño de archivo
    if (!this.validateFileSize(file)) {
      errors.push(
        `El archivo es demasiado grande. Tamaño máximo: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
