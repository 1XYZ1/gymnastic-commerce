/**
 * Hook personalizado para manejar etiquetas de productos
 *
 * Responsabilidad: Coordinar la lógica de añadir/eliminar tags
 * Extrae la lógica de tags del componente ProductForm
 */

import { useCallback } from 'react';

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
  /**
   * Añade una nueva etiqueta si no existe
   * Usa Set para evitar duplicados
   */
  const addTag = useCallback(
    (tag: string) => {
      const trimmedTag = tag.trim();

      // No agregar tags vacíos
      if (trimmedTag === '') return;

      // Usar Set para evitar duplicados
      const tagSet = new Set(currentTags);
      tagSet.add(trimmedTag);

      // Actualizar solo si cambió
      const newTags = Array.from(tagSet);
      if (newTags.length !== currentTags.length) {
        onTagsChange(newTags);
      }
    },
    [currentTags, onTagsChange]
  );

  /**
   * Elimina una etiqueta existente
   */
  const removeTag = useCallback(
    (tag: string) => {
      const tagSet = new Set(currentTags);
      tagSet.delete(tag);
      onTagsChange(Array.from(tagSet));
    },
    [currentTags, onTagsChange]
  );

  return {
    addTag,
    removeTag,
  };
};
