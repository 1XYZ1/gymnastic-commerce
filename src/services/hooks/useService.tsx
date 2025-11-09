import { useQuery } from '@tanstack/react-query';
import { getServiceRepository } from '../repositories';

/**
 * Hook para obtener un servicio específico por ID
 * Solo ejecuta la query si el ID está presente (enabled: !!id)
 */
export const useService = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => getServiceRepository().getServiceById(id),
    enabled: !!id,
  });
};
