import { useQuery } from '@tanstack/react-query';
import { serviceRepository } from '@/services/repositories';
import type { ServiceFilter } from '@/services/types/service.types';
import { SERVICES_CONFIG } from '@/services/config/service.config';

/**
 * Hook para obtener servicios en el panel admin
 * Similar a useServices pero diseñado para gestión administrativa
 */
export const useAdminServices = (filter?: Partial<ServiceFilter>) => {
  const fullFilter: ServiceFilter = {
    limit: filter?.limit ?? SERVICES_CONFIG.pagination.defaultLimit,
    offset: filter?.offset ?? 0,
    type: filter?.type,
  };

  return useQuery({
    queryKey: ['admin', 'services', fullFilter],
    queryFn: () => serviceRepository.getServices(fullFilter),
  });
};
