import { useQuery } from '@tanstack/react-query';
import { groomingRepository } from '../repositories';

/**
 * Hook para obtener un registro de grooming específico por ID
 * React Query maneja automáticamente el caching y revalidación
 */
export const useGroomingRecord = (id?: string) => {
  return useQuery({
    queryKey: ['grooming-record', id],
    queryFn: () => groomingRepository.findById(id!),
    enabled: !!id, // Solo ejecutar cuando id esté disponible
  });
};
