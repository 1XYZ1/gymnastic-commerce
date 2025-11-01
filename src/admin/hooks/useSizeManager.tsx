/**
 * Hook personalizado para manejar tallas de productos
 *
 * Responsabilidad: Coordinar la lógica de añadir/eliminar tallas
 * Usa el hook genérico useSetManager
 */

import type { Size } from '@/shared/types';
import { useSetManager } from './useSetManager';

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
  const { add, remove, has } = useSetManager<Size>(currentSizes, onSizesChange);

  return {
    addSize: add,
    removeSize: remove,
    hasSize: has,
  };
};
