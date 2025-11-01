/**
 * Servicio de subida de archivos
 *
 * Responsabilidad: Gestionar la subida de archivos al servidor
 * utilizando el cliente API configurado
 */

import { gymApi } from '@/api/gymApi';
import type { FileUploadResult } from '../types';

export class FileUploadService {
  /**
   * Sube múltiples archivos al servidor en paralelo
   *
   * @param files - Array de archivos File a subir
   * @returns Promise con array de nombres de archivo subidos
   * @throws Error si alguna subida falla
   */
  static async uploadFiles(files: File[]): Promise<string[]> {
    // Crear promesas de subida para cada archivo
    const uploadPromises = files.map(async (file) => {
      return await this.uploadSingleFile(file);
    });

    // Ejecutar todas las subidas en paralelo
    const uploadedFileNames = await Promise.all(uploadPromises);
    return uploadedFileNames;
  }

  /**
   * Sube un único archivo al servidor
   *
   * @param file - Archivo File a subir
   * @returns Promise con el nombre del archivo subido
   * @throws Error si la subida falla
   */
  private static async uploadSingleFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await gymApi<FileUploadResult>({
      url: '/files/product',
      method: 'POST',
      data: formData,
    });

    return data.fileName;
  }

}
