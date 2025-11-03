import { useQuery } from '@tanstack/react-query';
import { medicalRepository } from '../repositories';
import type { Vaccination } from '../types/medical.types';

/**
 * Hook para obtener vacunas de una mascota
 * Usa React Query para cache y sincronización con el servidor
 */
export const useVaccinations = (petId: string | undefined, enabled = true) => {
  return useQuery<Vaccination[], Error>({
    queryKey: ['vaccinations', petId],
    queryFn: () => {
      if (!petId) throw new Error('Pet ID is required');
      return medicalRepository.findVaccinationsByPetId(petId);
    },
    enabled: !!petId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook para obtener vacunas próximas a vencer (solo admin)
 * Endpoint: GET /api/medical-records/vaccinations/due
 */
export const useVaccinationsDue = (enabled = true) => {
  return useQuery<Vaccination[], Error>({
    queryKey: ['vaccinations-due'],
    queryFn: () => medicalRepository.findVaccinationsDue(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
