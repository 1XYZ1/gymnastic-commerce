import { useQuery } from '@tanstack/react-query';
import { medicalRepository } from '../repositories';
import type { MedicalRecord } from '../types/medical.types';

/**
 * Hook para obtener historial médico de una mascota
 * Usa React Query para cache y sincronización con el servidor
 */
export const useMedicalRecords = (petId: string | undefined, enabled = true) => {
  return useQuery<MedicalRecord[], Error>({
    queryKey: ['medical-records', petId],
    queryFn: () => {
      if (!petId) throw new Error('Pet ID is required');
      return medicalRepository.findByPetId(petId);
    },
    enabled: !!petId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
  });
};
