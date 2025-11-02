import { useQuery } from '@tanstack/react-query';
import { serviceRepository } from '../repositories';

/**
 * Hook para obtener un servicio específico por ID
 * Solo ejecuta la query si el ID está presente (enabled: !!id)
 */
export const useService = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => serviceRepository.getServiceById(id),
    enabled: !!id,
  });
};
