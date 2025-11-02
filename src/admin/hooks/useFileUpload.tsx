/**
 * Hook personalizado para manejar la subida de archivos con drag & drop
 *
 * Responsabilidad: Coordinar el estado y eventos de subida de archivos
 * Extrae la lógica de drag & drop del componente ProductForm
 */

import { useState, useCallback } from 'react';

export interface UseFileUploadReturn {
  files: File[];
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  clearFiles: () => void;
}

/**
 * Hook para gestionar subida de archivos con soporte drag & drop
 *
 * @param onFilesChange - Callback opcional cuando cambian los archivos
 * @returns Objeto con estado y handlers para drag & drop
 */
export const useFileUpload = (
  onFilesChange?: (files: File[]) => void
): UseFileUploadReturn => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  /**
   * Maneja los eventos de drag (enter, over, leave)
   */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  /**
   * Maneja el drop de archivos
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles || droppedFiles.length === 0) return;

    const newFiles = [...files, ...Array.from(droppedFiles)];
    setFiles(newFiles);

    // Notificar cambio si hay callback
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  /**
   * Maneja la selección de archivos mediante input
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles = [...files, ...Array.from(selectedFiles)];
    setFiles(newFiles);

    // Notificar cambio si hay callback
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  /**
   * Limpia todos los archivos seleccionados
   * Memoizada con useCallback para evitar loops infinitos en useEffect
   */
  const clearFiles = useCallback(() => {
    setFiles([]);
    if (onFilesChange) {
      onFilesChange([]);
    }
  }, [onFilesChange]);

  return {
    files,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileChange,
    setFiles,
    clearFiles,
  };
};
