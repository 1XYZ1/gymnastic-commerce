import { useState, useMemo } from 'react';
import { usePets } from './usePets';
import { PetSearchService } from '../services';
import type { Pet } from '../types';

/**
 * Interfaz de retorno del hook usePetsSearch
 */
export interface UsePetsSearchReturn {
  // Lista de mascotas filtradas
  pets: Pet[];
  // Todas las mascotas sin filtrar
  allPets: Pet[];
  // Estado de carga de las mascotas
  isLoading: boolean;
  // Estado de error
  error: Error | null;
  // Query de búsqueda actual
  searchQuery: string;
  // Función para actualizar el query de búsqueda
  setSearchQuery: (query: string) => void;
  // Total de mascotas sin filtrar
  totalPets: number;
  // Total de mascotas filtradas
  filteredCount: number;
  // Mensaje descriptivo del resultado de búsqueda
  summary: string;
}

/**
 * Hook para búsqueda y filtrado de mascotas
 * Orquesta la obtención de datos y filtrado pero NO contiene lógica de negocio
 *
 * @returns Objeto con mascotas filtradas y estado de búsqueda
 */
export const usePetsSearch = (): UsePetsSearchReturn => {
  // Estado local para el término de búsqueda
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Obtener todas las mascotas (límite alto para búsqueda completa)
  const { data: allPets = [], isLoading, error } = usePets({ limit: 100 });

  // Filtrar mascotas usando el servicio de búsqueda
  const filteredPets = useMemo(() => {
    return PetSearchService.searchPets(allPets, searchQuery);
  }, [allPets, searchQuery]);

  // Generar resumen de búsqueda usando el servicio
  const summary = useMemo(() => {
    return PetSearchService.getSearchSummary(
      allPets.length,
      filteredPets.length,
      searchQuery
    );
  }, [allPets.length, filteredPets.length, searchQuery]);

  return {
    pets: filteredPets,
    allPets,
    isLoading,
    error: error || null,
    searchQuery,
    setSearchQuery,
    totalPets: allPets.length,
    filteredCount: filteredPets.length,
    summary,
  };
};
