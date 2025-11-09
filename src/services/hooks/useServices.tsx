import { useQuery } from '@tanstack/react-query';
import { getServiceRepository } from '../repositories';
import type { ServiceFilter } from '../types/service.types';
import { SERVICES_CONFIG } from '../config/service.config';

/**
 * Hook para obtener lista de servicios con filtros opcionales
 * Maneja el fetching, caching y sincronización con React Query
 */
export const useServices = (filter?: Partial<ServiceFilter>) => {
  const fullFilter: ServiceFilter = {
    limit: filter?.limit ?? SERVICES_CONFIG.pagination.defaultLimit,
    offset: filter?.offset ?? 0,
    type: filter?.type,
  };

  return useQuery({
    queryKey: ['services', fullFilter],
    queryFn: () => getServiceRepository().getServices(fullFilter),
  });
};
