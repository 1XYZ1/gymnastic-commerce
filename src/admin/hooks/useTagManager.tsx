/**
 * Hook personalizado para manejar etiquetas de productos
 *
 * Responsabilidad: Coordinar la lógica de añadir/eliminar tags
 * Usa el hook genérico useSetManager
 */

import { useSetManager } from './useSetManager';

export interface UseTagManagerReturn {
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}

/**
 * Hook para gestionar etiquetas de productos
 *
 * @param currentTags - Array actual de etiquetas
 * @param onTagsChange - Callback para actualizar las etiquetas
 * @returns Objeto con funciones para manipular tags
 */
export const useTagManager = (
  currentTags: string[],
  onTagsChange: (tags: string[]) => void
): UseTagManagerReturn => {
  const { add, remove } = useSetManager<string>(currentTags, onTagsChange, {
    // Normalizador: trim y validar que no esté vacío
    normalizer: (tag) => {
      const trimmed = tag.trim();
      return trimmed === '' ? null : trimmed;
    },
  });

  return {
    addTag: add,
    removeTag: remove,
  };
};
