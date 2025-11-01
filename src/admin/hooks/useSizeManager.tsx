/**
 * Hook personalizado para manejar tallas de productos
 *
 * Responsabilidad: Coordinar la lógica de añadir/eliminar tallas
 * Extrae la lógica de sizes del componente ProductForm
 */

import { useCallback } from 'react';
import type { Size } from '@/interfaces/product.interface';

export interface UseSizeManagerReturn {
  addSize: (size: Size) => void;
  removeSize: (size: Size) => void;
  hasSize: (size: Size) => boolean;
}

/**
 * Hook para gestionar tallas de productos
 *
 * @param currentSizes - Array actual de tallas
 * @param onSizesChange - Callback para actualizar las tallas
 * @returns Objeto con funciones para manipular sizes
 */
export const useSizeManager = (
  currentSizes: Size[],
  onSizesChange: (sizes: Size[]) => void
): UseSizeManagerReturn => {
  /**
   * Añade una nueva talla si no existe
   */
  const addSize = useCallback(
    (size: Size) => {
      const sizeSet = new Set(currentSizes);

      // Solo agregar si no existe
      if (!sizeSet.has(size)) {
        sizeSet.add(size);
        onSizesChange(Array.from(sizeSet));
      }
    },
    [currentSizes, onSizesChange]
  );

  /**
   * Elimina una talla existente
   */
  const removeSize = useCallback(
    (size: Size) => {
      const sizeSet = new Set(currentSizes);
      sizeSet.delete(size);
      onSizesChange(Array.from(sizeSet));
    },
    [currentSizes, onSizesChange]
  );

  /**
   * Verifica si una talla existe en la lista
   */
  const hasSize = useCallback(
    (size: Size) => {
      return currentSizes.includes(size);
    },
    [currentSizes]
  );

  return {
    addSize,
    removeSize,
    hasSize,
  };
};
