/**
 * Hook genérico para manejar conjuntos de elementos únicos
 *
 * Responsabilidad: Extraer la lógica común de gestión de Sets
 * Elimina duplicación entre useTagManager y useSizeManager
 */

import { useCallback } from 'react';

export interface UseSetManagerReturn<T> {
  add: (item: T) => void;
  remove: (item: T) => void;
  has: (item: T) => boolean;
}

export interface UseSetManagerOptions<T> {
  /**
   * Función para normalizar/validar el elemento antes de agregarlo
   * Por ejemplo: trim() para strings
   * Retorna null si la validación falla
   */
  normalizer?: (item: T) => T | null;
}

/**
 * Hook genérico para gestionar conjuntos de elementos únicos
 *
 * @param currentItems - Array actual de elementos
 * @param onItemsChange - Callback para actualizar los elementos
 * @param options - Opciones de configuración
 * @returns Objeto con funciones para manipular el Set
 */
export const useSetManager = <T,>(
  currentItems: T[],
  onItemsChange: (items: T[]) => void,
  options: UseSetManagerOptions<T> = {}
): UseSetManagerReturn<T> => {
  const { normalizer } = options;

  /**
   * Añade un elemento si no existe
   */
  const add = useCallback(
    (item: T) => {
      // Aplicar normalizador si existe
      const normalizedItem = normalizer ? normalizer(item) : item;

      // No agregar si el normalizador retorna null (validación falló)
      if (normalizedItem === null) return;

      const itemSet = new Set(currentItems);
      const previousSize = itemSet.size;

      itemSet.add(normalizedItem);

      // Solo actualizar si realmente cambió
      if (itemSet.size !== previousSize) {
        onItemsChange(Array.from(itemSet));
      }
    },
    [currentItems, onItemsChange, normalizer]
  );

  /**
   * Elimina un elemento existente
   */
  const remove = useCallback(
    (item: T) => {
      const itemSet = new Set(currentItems);
      itemSet.delete(item);
      onItemsChange(Array.from(itemSet));
    },
    [currentItems, onItemsChange]
  );

  /**
   * Verifica si un elemento existe en la lista
   */
  const has = useCallback(
    (item: T) => {
      return currentItems.includes(item);
    },
    [currentItems]
  );

  return {
    add,
    remove,
    has,
  };
};
