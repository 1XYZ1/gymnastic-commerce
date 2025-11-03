import type { Pet } from '../types';

/**
 * Servicio para búsqueda y filtrado de mascotas
 * Lógica de negocio pura sin dependencias de React
 */
export class PetSearchService {
  /**
   * Filtra mascotas por nombre de mascota o nombre del dueño
   * La búsqueda es case-insensitive e incluye coincidencias parciales
   *
   * @param pets - Lista de mascotas a filtrar
   * @param query - Término de búsqueda
   * @returns Lista de mascotas que coinciden con el término de búsqueda
   */
  static searchPets(pets: Pet[], query: string): Pet[] {
    // Si no hay query, retornar todas las mascotas
    if (!query || query.trim() === '') {
      return pets;
    }

    const normalizedQuery = query.toLowerCase().trim();

    return pets.filter((pet) => {
      // Buscar en el nombre de la mascota
      const petNameMatch = pet.name.toLowerCase().includes(normalizedQuery);

      // Buscar en el nombre del dueño si existe
      const ownerNameMatch = pet.owner?.fullName
        ? pet.owner.fullName.toLowerCase().includes(normalizedQuery)
        : false;

      return petNameMatch || ownerNameMatch;
    });
  }

  /**
   * Genera un resumen de los resultados de búsqueda
   *
   * @param totalPets - Total de mascotas antes del filtrado
   * @param filteredPets - Total de mascotas después del filtrado
   * @param query - Término de búsqueda aplicado
   * @returns Mensaje descriptivo del resultado de búsqueda
   */
  static getSearchSummary(
    totalPets: number,
    filteredPets: number,
    query: string
  ): string {
    // Si no hay query, mostrar total
    if (!query || query.trim() === '') {
      return `Mostrando ${totalPets} ${totalPets === 1 ? 'mascota' : 'mascotas'}`;
    }

    // Si hay query pero no hay resultados
    if (filteredPets === 0) {
      return `No se encontraron mascotas que coincidan con "${query}"`;
    }

    // Si hay resultados filtrados
    return `Mostrando ${filteredPets} de ${totalPets} ${
      filteredPets === 1 ? 'mascota' : 'mascotas'
    } que coinciden con "${query}"`;
  }
}
