import { useQuery } from '@tanstack/react-query';
import { groomingRepository } from '../repositories';

/**
 * Hook para obtener el historial de grooming de una mascota
 * React Query maneja automáticamente el caching y revalidación
 */
export const useGroomingRecords = (petId?: string) => {
  return useQuery({
    queryKey: ['grooming-records', petId],
    queryFn: () => groomingRepository.findByPetId(petId!),
    enabled: !!petId, // Solo ejecutar cuando petId esté disponible
    staleTime: 5 * 60 * 1000, // Los datos se consideran frescos por 5 minutos
  });
};
