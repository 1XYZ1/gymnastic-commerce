import type { Pet } from '../types';
import type { PetSpecies } from '@/shared/types/enums';

/**
 * Interfaz para estadísticas de distribución por especie
 */
export interface SpeciesDistribution {
  species: PetSpecies;
  count: number;
  percentage: number;
}

/**
 * Servicio para calcular estadísticas de mascotas
 * Lógica de negocio pura sin dependencias de React
 */
export class PetStatsService {
  /**
   * Obtiene el total de mascotas activas
   */
  static getTotalPets(pets: Pet[]): number {
    return pets.filter((pet) => pet.isActive).length;
  }

  /**
   * Calcula la distribución de mascotas por especie
   * Incluye el conteo y porcentaje de cada especie
   */
  static getPetsBySpecies(pets: Pet[]): SpeciesDistribution[] {
    const activePets = pets.filter((pet) => pet.isActive);
    const total = activePets.length;

    if (total === 0) {
      return [];
    }

    // Agrupar por especie
    const speciesCount = activePets.reduce(
      (acc, pet) => {
        acc[pet.species] = (acc[pet.species] || 0) + 1;
        return acc;
      },
      {} as Record<PetSpecies, number>
    );

    // Convertir a array con porcentajes
    return Object.entries(speciesCount).map(([species, count]) => ({
      species: species as PetSpecies,
      count,
      percentage: Math.round((count / total) * 100),
    }));
  }

  /**
   * Obtiene las mascotas más recientes ordenadas por fecha de creación
   */
  static getRecentPets(pets: Pet[], limit = 5): Pet[] {
    return pets
      .filter((pet) => pet.isActive)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Orden descendente (más recientes primero)
      })
      .slice(0, limit);
  }

  /**
   * Cuenta las mascotas que no tienen foto de perfil
   */
  static getPetsWithoutPhoto(pets: Pet[]): number {
    return pets.filter((pet) => pet.isActive && !pet.profilePhoto).length;
  }

  /**
   * Calcula la edad promedio de las mascotas en años
   * Retorna null si no hay mascotas con fecha de nacimiento válida
   */
  static getAverageAge(pets: Pet[]): number | null {
    const activePets = pets.filter((pet) => pet.isActive && pet.birthDate);

    if (activePets.length === 0) {
      return null;
    }

    const now = new Date();
    const totalAgeInYears = activePets.reduce((sum, pet) => {
      const birthDate = new Date(pet.birthDate);
      const ageInYears =
        (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return sum + ageInYears;
    }, 0);

    return Math.round((totalAgeInYears / activePets.length) * 10) / 10; // Redondear a 1 decimal
  }

  /**
   * Obtiene la especie más común
   * Retorna null si no hay mascotas
   */
  static getMostCommonSpecies(pets: Pet[]): PetSpecies | null {
    const distribution = this.getPetsBySpecies(pets);

    if (distribution.length === 0) {
      return null;
    }

    return distribution.reduce((prev, current) =>
      current.count > prev.count ? current : prev
    ).species;
  }
}
