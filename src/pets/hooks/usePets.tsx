import { useQuery } from '@tanstack/react-query';
import { petRepository } from '../repositories';
import type { Pet } from '../types';

interface UsePetsParams {
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

export const usePets = (params?: UsePetsParams) => {
  const { limit = 10, offset = 0, enabled = true } = params || {};

  return useQuery<Pet[], Error>({
    queryKey: ['pets', { limit, offset }],
    queryFn: () => petRepository.findAll({ limit, offset }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
  });
};
