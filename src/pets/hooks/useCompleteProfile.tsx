import { useQuery } from '@tanstack/react-query';
import { getPetRepository } from '../repositories';
import type { CompleteProfile } from '../types';

export const useCompleteProfile = (petId: string | undefined, enabled = true) => {
  return useQuery<CompleteProfile, Error>({
    queryKey: ['pet-complete-profile', petId],
    queryFn: () => {
      if (!petId) throw new Error('Pet ID is required');
      return getPetRepository().getCompleteProfile(petId);
    },
    enabled: !!petId && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutos (datos cambian más frecuentemente)
    gcTime: 5 * 60 * 1000,
  });
};
