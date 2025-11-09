import { useQuery } from '@tanstack/react-query';
import { getPetRepository } from '../repositories';
import type { Pet } from '../types';

export const usePet = (id: string | undefined, enabled = true) => {
  return useQuery<Pet, Error>({
    queryKey: ['pet', id],
    queryFn: () => {
      if (!id) throw new Error('Pet ID is required');
      return getPetRepository().findById(id);
    },
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,
  });
};
